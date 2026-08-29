import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  restaurantId: z.string(),
  title: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check if user is the owner of the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parsed.data.restaurantId },
      select: { createdById: true },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    if (restaurant.createdById === session.user.id) {
      return NextResponse.json(
        { error: "You cannot review your own restaurant" },
        { status: 403 }
      );
    }

    const review = await prisma.review.create({
      data: {
        ...parsed.data,
        userId: session.user.id!,
      },
      include: { user: { select: { name: true, image: true } } },
    });

    // Update restaurant rating
    const reviews = await prisma.review.findMany({
      where: { restaurantId: parsed.data.restaurantId },
      select: { rating: true },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.restaurant.update({
      where: { id: parsed.data.restaurantId },
      data: { avgRating, reviewCount: reviews.length },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
