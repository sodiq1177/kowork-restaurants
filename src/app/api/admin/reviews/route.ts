import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        restaurant: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin reviews GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { restaurantId: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    // Recalculate restaurant ratings
    const remainingReviews = await prisma.review.findMany({
      where: { restaurantId: review.restaurantId },
      select: { rating: true },
    });

    const avgRating = remainingReviews.length
      ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
        remainingReviews.length
      : 0;

    await prisma.restaurant.update({
      where: { id: review.restaurantId },
      data: {
        avgRating,
        reviewCount: remainingReviews.length,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin reviews DELETE error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
