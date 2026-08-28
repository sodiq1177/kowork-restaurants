import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const review = await prisma.review.findUnique({
    where: { id: params.id },
  });

  if (review?.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.review.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ review: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const review = await prisma.review.findUnique({
    where: { id: params.id },
    select: { userId: true, restaurantId: true },
  });

  if (review?.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id: params.id } });

  // Update restaurant rating
  const reviews = await prisma.review.findMany({
    where: { restaurantId: review.restaurantId },
    select: { rating: true },
  });

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await prisma.restaurant.update({
    where: { id: review.restaurantId },
    data: { avgRating, reviewCount: reviews.length },
  });

  return NextResponse.json({ success: true });
}
