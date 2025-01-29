import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/users";

export async function GET(req: NextRequest){
    await dbConnect();
    const id = req.nextUrl.searchParams.get('id')
    const friendId = req.nextUrl.searchParams.get('friendId');

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if(!user || !friend)
        return NextResponse.json({ success: false, data: "User does not exist" }, { status: 404 });
    
    await User.findByIdAndUpdate(id, {friends: [...user.friends, {id: friend._id, name: friend.name}], pendingfriends: user.pendingfriends.filter((pendingfriend: any) => pendingfriend.id !== friendId)});

    await User.findByIdAndUpdate(friendId, {friends: [...friend.friends, {id: user._id, name: user.name}], pendingfriends: friend.pendingfriends.filter((pendingfriend: any) => pendingfriend.id !== id)});
}