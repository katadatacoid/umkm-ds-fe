import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({ message: 'Hello from Next.js 13 API Route!' }),
    { status: 200 }
  );
}