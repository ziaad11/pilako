import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Pilako API is being rebuilt.",
  });
}