"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { getSocket } from "../../functions/socket";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import SendFriendRequest from "../sendFriendRequest/sendFriendRequest";
import Image from "next/image";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";

export default function Friends() {
    const router = useRouter()
    const session = useSession()
    const socketRef = useRef<Socket | null>(null);
    const [friends, setFriends] = useState<any | null>([]);

    useEffect(() => {
        if (session.data && session.data.user && !session.data.user.pending) {
            fetch(`/api/getFriends?id=${session.data.user.id}`)
                .then(response => response.json())
                .then(data => {
                    socketRef.current = getSocket(session.data.user, router)
                    console.log(getSocket(session.data.user, router))
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
        <div className="mr-auto">
            <div className="flex items-center mb-5 gap-5">
                <h1 className="text-xl font-medium">Friends</h1>
                <SendFriendRequest />
            </div>
            <div className="flex flex-col gap-3">
                {
                    friends && friends.map((friend: any, i: number) => (
                        <div key={i} className="flex gap-[20%] items-center">
                            <div className="flex gap-5 items-center">
                                <Image src={friend.img} alt="user" width={100} height={100} />
                                <p className="font-medium">{friend.name}</p>
                            </div>
                            <div>
                                <Dialog>
                                    <DialogTrigger>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Image src={'/challenge.png'} alt="challenge" width={40} height={40} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <>
                                                        <p>Challenge</p>
                                                    </>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Challenge</DialogTitle>
                                            <DialogDescription>
                                                Challenging {friends.name} 
                                                <Image src={friends.img} alt=""></Image>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Button onClick={() => {
                                            if (socketRef.current){
                                                socketRef.current.emit('challenge', friend.id)
                                            }
                                        }}>
                                            Challenge
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Image src={'/unfriend.png'} alt="challenge" width={40} height={40} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Remove Friend</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Do you want to remove this friend?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                ...
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => { unFriend(friend.id) }}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}