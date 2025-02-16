"use server"

import {NextResponse} from "next/server";
export async function GET() {
    const response = NextResponse.json({message: 'Cookie remove successfully'}, {status: 200});
    response.cookies.set('refreshToken', '', {
        maxAge: 0,
        path: '/'
    });
    return response;
}