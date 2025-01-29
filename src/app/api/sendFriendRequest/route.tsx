import { NextResponse } from 'next/server';
import dbConnect from "./../../../../lib/dbConnect";
import User from "./../../../../models/users";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const user = await User.findById(body[0]);
        if(user)
            await User.findByIdAndUpdate(body[0], {pendingfriends: [...user.pendingfriends, {id: body[2], name: body[1]}]});
        // const user = await User.create(data);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}