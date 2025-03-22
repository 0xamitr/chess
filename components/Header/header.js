"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Header() {
    const session = useSession()
    console.log(session)
    return (
        <header className="flex p-5 pl-[10%] pr-[10%] justify-between">
            <h1 className="text-2xl"><Link href="/">CHESSY.Tech</Link></h1>
            <div>
                {
                    session.status != "loading" && !session.data &&
                    <Link href="/signin">Sign in</Link>
                }
                {
                    (session.status == "loading" || (session.status != "loading" && session.data)) &&
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                {session.data && <AvatarImage src={session.data.user.image} />}
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild><Link href={'/profile'}>Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><button onClick={() => { signOut() }}>Logout</button></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>



                }
            </div>
        </header>
    )
}