import { NextResponse } from 'next/server';
import dbConnect from "./../../../../lib/dbConnect";
import User from "./../../../../models/users";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        console.log(body[0])
        const user = await User.findById(body[0]);
        console.log(body)
        console.log(user)
        for (const friend of user.pendingfriends) {
            if (friend.id == body[2]) {
                return NextResponse.json({ success: false, data: "Friend Request sent Already" }, { status: 400 });
            }
        }
        for (const friend of user.friends) {
            if (friend.id == body[2])
                return NextResponse.json({ success: false, data: "You are already friends" }, { status: 400 });
        }
        console.log("what")
        if (user)
            await User.findByIdAndUpdate(body[0], { pendingfriends: [...user.pendingfriends, { id: body[2], name: body[1] }] });
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, data: error.message }, { status: 400 });
    }
}