import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getSocket } from "../../functions/socket";

export default function Friends() {
    const socket = getSocket()
    const session = useSession()
    const [friends, setFriends] = useState<any | null>([]);
    useEffect(() => {
        if (session.data && session.data.user) {
            fetch(`/api/getFriends?id=${session.data.user.id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data)
                    setFriends(data.data);
                })
                .catch(error => console.log(error))
        }
    }, [session])
    
    return (
        <div>
            <h1>Friends</h1>
            {
                friends && friends.map((friend: any, i: number) => (
                    <div key={i}>
                        <p>{friend.name}</p>
                        <button onClick={() => {
                            console.log("socket", socket)
                            socket.emit('challenge', friend.id)
                        }}>Challenge</button>
                    </div>
                ))
            }
        </div>
    )
}