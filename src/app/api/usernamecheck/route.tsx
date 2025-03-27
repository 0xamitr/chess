import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "./../../../../lib/dbConnect";
import User from "./../../../../models/users";

export async function POST(req: NextRequest) {
    const body = await req.json();
    await dbConnect();
    const username = body.username.toLowerCase()
    try {
        const user = await User.findOne({ name: username });
        if (user) {
            return NextResponse.json({ success: true, data: "user exists" }, { status: 200 });
        }
        else
            return NextResponse.json({ success: false, data: 'User does not exist' }, { status: 409 });
    }
    catch {
        return NextResponse.json({success: false, data: "Something went wrong. Please try again."}, {status: 400})
    }
}