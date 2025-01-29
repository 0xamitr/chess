import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/users";

export async function GET(req: NextRequest) {
    await dbConnect();
    const id = req.nextUrl.searchParams.get('id')
    const user = await User.findById(id)
    if(!user)
        return NextResponse.json({ success: false, data: "User does not exist" }, { status: 404 });
    return NextResponse.json({ success: true, data:  user.pendingfriends}, { status: 200 });
}  