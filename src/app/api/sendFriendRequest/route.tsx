import { NextResponse } from 'next/server';
import dbConnect from "./../../../../lib/dbConnect";
import User from "./../../../../models/users";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const user = await User.findById(body[0]);
        for (const friend of user.pendingfriends) {
            console.log(friend.id, body[2])
            if (friend.id == body[2]) {
                return NextResponse.json({ success: false, data: "Friend Request sent Already" }, { status: 400 });
            }
        }
        for (const friend of user.friends) {
            console.log(friend.id, body[2])
            if (friend.id == body[2])
                return NextResponse.json({ success: false, data: "You are already friends" }, { status: 400 });
        }
        console.log("wtf", user.pendingfriends)
        if (user)
            await User.findByIdAndUpdate(body[0], { pendingfriends: [...user.pendingfriends, { id: body[2], name: body[1] }] });
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}