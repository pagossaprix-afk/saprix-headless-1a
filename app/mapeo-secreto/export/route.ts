import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Esto le dice a Vercel que no invente

export async function GET() {
  return NextResponse.json({ mensaje: "Prueba de vida, todo bien por acá" });
}