import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().optional(),
  openingHours: z.string().optional(),
  priceLevel: z.enum(["BUDGET", "MODERATE", "EXPENSIVE", "LUXURY"]).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrl: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const priceLevel = searchParams.get("priceLevel") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where: Prisma.RestaurantWhereInput = {};
  if (q) where.name = { contains: q };
  if (category) where.category = category;
  if (minRating > 0) where.avgRating = { gte: minRating };
  if (priceLevel) where.priceLevel = priceLevel;

  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      include: {
        images: { take: 1 },
        _count: { select: { reviews: true } },
      },
      orderBy: { avgRating: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.restaurant.count({ where }),
  ]);

  return NextResponse.json({ restaurants, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { imageUrl, ...restData } = parsed.data;

    const restaurant = await prisma.restaurant.create({
      data: {
        ...restData,
        createdById: session.user.id!,
        images: imageUrl?.trim()
          ? {
              create: [{ url: imageUrl.trim() }],
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
