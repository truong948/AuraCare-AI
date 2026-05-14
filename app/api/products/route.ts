import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data/catalog";

export async function GET() {
  return NextResponse.json({ products: mockProducts });
}
