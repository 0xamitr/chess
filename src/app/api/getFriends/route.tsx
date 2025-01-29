import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/users";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    await dbConnect();
    const user = await User.findById(id);
    return NextResponse.json({success: true, data: user.friends});
}