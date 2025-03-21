"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { getSocket } from "../../functions/socket";
import { useRouter } from "next/navigation";
import { usePopup } from "../context/PopupContext";
import { Socket } from "socket.io-client";
import { Fira_Sans } from "next/font/google";

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
                })
                .catch(error => console.log(error))
        }
    }, [session])

    const unFriend = (id: String)=>{
        if(session.data && session.data.user && !session.data.user.pending){
            fetch(`/api/removefriend?id1=${id}&id2=${session.data.user.id}`, {
                method: 'PUT',
            })
        }
    }
    return (
        <div>&&
            <h1>Friends</h1>
            {
                friends && friends.map((friend: any, i: number) => (
                    <div key={i}>
                        <p>{friend.name}</p>
                        <button onClick={() => {
                            if(socketRef.current)
                                socketRef.current.emit('challenge', friend.id)
                        }}>Challenge</button>
                        <button onClick={()=>{unFriend(friend.id)}}>
                            unfriend
                        </button>
                    </div>
                ))
            }
        </div>
    )
}