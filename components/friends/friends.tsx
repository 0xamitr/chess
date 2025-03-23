"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { getSocket } from "../../functions/socket";
import { useRouter } from "next/navigation";
import { usePopup } from "../context/PopupContext";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Friends() {
    const router = useRouter()
    const session = useSession()
    const { showPopup } = usePopup()
    const socketRef = useRef<Socket | null>(null);
    const [friends, setFriends] = useState<any | null>([]);

    useEffect(() => {
        if (session.data && session.data.user && !session.data.user.pending) {
            fetch(`/api/getFriends?id=${session.data.user.id}`)
                .then(response => response.json())
                .then(data => {
                    socketRef.current = getSocket(session.data.user, showPopup, router)
                    setFriends(data.data);
                    console.log(data.data)
                })
                .catch(error => console.log(error))
        }
    }, [session])

    const unFriend = async (id: String) => {
        console.log(1)
        if (session.data && session.data.user && !session.data.user.pending) {
            console.log(2)
            const response = await fetch(`/api/removefriend?id1=${id}&id2=${session.data.user.id}`, {
                method: 'PUT',
            })
            if (response.ok) {
                setFriends(friends.filter((friend: any) => friend.id !== id))
            }
        }
    }
    return (
        <div className="max-w-5/10">
            <div className="flex items-center mb-5 gap-5">
                <h1 className="text-xl font-medium">Friends</h1>
                <div>
                    <Link className="text-blue-500 hover:underline font-medium" href="/newfriend">Add Friend</Link>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {
                    friends && friends.map((friend: any, i: number) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="flex gap-5 items-center">
                                <Image src={friend.img} alt="user" width={100} height={100} />
                                <p className="font-medium">{friend.name}</p>
                            </div>
                            <div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <button onClick={() => {
                                                if (socketRef.current)
                                                    socketRef.current.emit('challenge', friend.id)
                                            }}>
                                                <Image src={'/challenge.png'} alt="challenge" width={40} height={40} />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Challenge</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <button onClick={() => { unFriend(friend.id) }}>
                                                <Image src={'/unfriend.png'} alt="challenge" width={40} height={40} />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Remove Friend</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}