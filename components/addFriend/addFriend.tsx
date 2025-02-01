import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./addFriend.module.css";

export default function addFriend() {
    const [friendRequests, setFriendRequests] = useState<any | null>([]);
    const session = useSession()
    const getFriendRequests = () => {
        if (session && session.data && session.data.user) {
            fetch(`/api/getFriendRequests?id=${session.data.user.id}`)
                .then(response => response.json())
                .then(data => {
                    setFriendRequests(data.data);
                    console.log(data.data)
                })
                .catch(error => console.log(error))
        }
    }
    useEffect(() => {
        if (session)
            getFriendRequests()
    }, [session])

    const acceptFriendRequest = (friendId: String): void => {
        if (session && session.data && session.data.user) {
            console.log("friendid", friendId)
            fetch(`/api/acceptFriendRequest?id=${session.data.user.id}&friendId=${friendId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => console.log(error))
        }
    }

    const addFriend = (id: String): void => {
        acceptFriendRequest(id)
        console.log("Friend added");
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