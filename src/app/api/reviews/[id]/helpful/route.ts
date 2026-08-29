import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST toggle helpful vote
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: reviewId } = await params;

    // Check if already voted
    const existing = await prisma.reviewHelpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id!,
          reviewId,
        },
      },
    });

    if (existing) {
      // Remove vote
      await prisma.reviewHelpfulVote.delete({
        where: { id: existing.id },
      });

      // Decrement helpful count
      await prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { decrement: 1 } },
      });

      return NextResponse.json({ voted: false, message: "Vote removed" });
    } else {
      // Add vote
      await prisma.reviewHelpfulVote.create({
        data: {
          userId: session.user.id!,
          reviewId,
        },
      });

      // Increment helpful count
      await prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      });

      return NextResponse.json({ voted: true, message: "Vote added" });
    }
  } catch (error) {
    console.error("Helpful vote error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET check if user voted
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ voted: false });
  }

  try {
    const { id: reviewId } = await params;

    const vote = await prisma.reviewHelpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id!,
          reviewId,
        },
      },
    });

    return NextResponse.json({ voted: !!vote });
  } catch (error) {
    console.error("Helpful vote check error:", error);
    return NextResponse.json({ voted: false });
  }
}
