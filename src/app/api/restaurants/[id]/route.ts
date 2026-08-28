import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      reviews: {
        include: {
          user: { select: { name: true, image: true } },
          images: true,
        },
        orderBy: { createdAt: "desc" },
      },
      createdBy: { select: { name: true } },
    },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ restaurant });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const restaurant = await prisma.restaurant.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ restaurant });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.restaurant.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
