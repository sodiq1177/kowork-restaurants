import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      images: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true, image: true } },
          images: true,
        },
        orderBy: { createdAt: "desc" },
      },
      createdBy: { select: { id: true, name: true } },
    },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ restaurant });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { createdById: true },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAllowed =
    restaurant.createdById === session.user.id || session.user.role === "ADMIN";

  if (!isAllowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { imageUrl, ...restData } = body;

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      ...restData,
      images: imageUrl
        ? {
            deleteMany: {},
            create: [{ url: imageUrl.trim() }],
          }
        : undefined,
    },
    include: { images: true },
  });

  return NextResponse.json({ restaurant: updatedRestaurant });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { createdById: true },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAllowed =
    restaurant.createdById === session.user.id || session.user.role === "ADMIN";

  if (!isAllowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.restaurant.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
