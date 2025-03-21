import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./addFriend.module.css";

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

    const acceptFriendRequest = async(friendId: String) => {
        if (session && session.data && session.data.user && !session.data.user.pending) {
            const response = await fetch(`/api/acceptFriendRequest?id=${session.data.user.id}&friendId=${friendId}`)
            if(response.ok){
                console.log(friendRequests)
            }
        }
    }

    const addFriend = (id: String): void => {
        acceptFriendRequest(id)
    }
    return (
        <>
            {friendRequests[0] &&
                <div className={styles.addfriend}>
                    <h3>Add Friend</h3>
                    <div>
                        {friendRequests.map((friend: any, i: number) => (
                            <div key={i}>
                                <p>{friend.name}</p>
                                <button onClick={() => addFriend(friend.id)}>Add Friend</button>
                            </div>
                        ))
                        }
                    </div>
                </div>
            }
        </>
    )
}