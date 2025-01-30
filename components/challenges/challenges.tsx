import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getSocket } from "../../functions/socket"
import { Socket } from "socket.io-client"
import styles from './challenges.module.css'

export default function Challenges() {
    const session = useSession()
    const [challenge, setChallenge] = useState<String | null>(null)
    useEffect(() => {
        if (session && session.data && session.data.user) {
            const socket = getSocket(session.data.user.id)
            socket.on('challenge-received', (fromId: String) => {
                console.log("Challenge received from", fromId)
                setChallenge(fromId)
            })
        }
    }, [session])

    return (
        <div>
            {challenge &&
                <div className={styles.challenge}>
                    <p>New Challenge</p>
                    <button onClick={()=>{
                        console.log("socket", getSocket(session.data?.user.id))
                        getSocket(session.data?.user.id).emit('challenge-accepted', challenge)
                        setChallenge(null)
                    }}>
                        Accept
                    </button>
                    <button onClick={()=>{
                        setChallenge(null)
                    }}>
                        Decline
                    </button>
                </div>
            }
        </div>
    )
}