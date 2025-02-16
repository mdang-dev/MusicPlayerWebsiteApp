"use server"

import {NextRequest, NextResponse} from "next/server";
export async function POST(req: NextRequest) {
    const { refreshToken } = await req.json();
    if(!refreshToken) return NextResponse.json({ error: "refreshToken is missing" }, { status: 400 });
    const response = NextResponse.json({message: 'Cookie set successfully'}, {status: 200});
    response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    });
    return response;
}