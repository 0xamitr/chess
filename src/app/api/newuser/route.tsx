import { NextRequest } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/users";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();
    const cook = cookies().get('pending_registration')
    console.log(cook)
    if (!cook)
        return NextResponse.json({ success: false, data: "No pending registration" }, { status: 400 });
    try {
        const body = await req.json();
        const data = {
            name: body.username,
            email: body.email,
            provider: "google"
        }
        const user = await User.create(data);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}