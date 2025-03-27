import { NextRequest } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/users";
import { NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        if (!body.pending)
            return NextResponse.json({ success: false, data: "No pending registration" }, { status: 400 });
        console.log(body)
        console.log(body.img)
        const username = body.username.toLowerCase()
        const data = {
            name: username,
            email: body.email,
            img: body.img,
            provider: "google"
        }
        try{
        const user = await User.create(data);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
        }
        catch{
            return NextResponse.json({ success: false, data: "User already exists" }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, data: 'Somhing went wrong. Try again later.' }, { status: 400 });
    }
}