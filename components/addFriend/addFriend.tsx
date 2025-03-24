import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function AddFriend() {
    const [friendRequests, setFriendRequests] = useState<any | null>([]);
    const session = useSession()
    const getFriendRequests = () => {
        if (session && session.data && session.data.user && !session.data.user.pending) {
            fetch(`/api/getFriendRequests?id=${session.data.user.id}`)
                .then(response => response.json())
                .then(data => {
                    console.log("hellno")
                    setFriendRequests(data.data);
                })
                .catch(error => console.log(error))
        }
    }
    useEffect(() => {
        if (session)
            getFriendRequests()
    }, [session])

    const acceptFriendRequest = async (friendId: String) => {
        if (session && session.data && session.data.user && !session.data.user.pending) {
            const response = await fetch(`/api/acceptFriendRequest?id=${session.data.user.id}&friendId=${friendId}`)
            if (response.ok) {
                console.log(friendRequests)
                getFriendRequests()
            }
        }
    }

    const addFriend = (id: String): void => {
        acceptFriendRequest(id)
    }
    return (
        <>
            {friendRequests[0] &&
                <div className="mb-[5%] flex flex-col gap-3">
                    <h2 className="text-xl font-medium mb-2">Friend Requests</h2>
                    <div>
                        {friendRequests.map((friend: any, i: number) => (
                            <div key={i} className="pl-5 pr-5 pt-1 pb-1 flex gap-10 items-center border-2 border-sky-600 float-left">
                                <p>{friend.name}</p>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => addFriend(friend.id)}><Image src='/checked.png' alt='accept' height={30} width={30}></Image></button>
                                    <button onClick={() => console.log("remove")}><Image src='/close.png' alt='decline' height={30} width={30}></Image></button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}