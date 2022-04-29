import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Plz dont be a bot. be human.", { status: 403 });
  }

  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.carrotsession) {
      return NextResponse.redirect(`${req.nextUrl.origin}/enter`);
    }
  }
}

//미들웨어 사용
