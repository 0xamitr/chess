"use client"

import { useSession } from "next-auth/react"

export default function Profile(){
    const session = useSession()
    console.log(session)
    return(
        <div>
            <h1>Profile</h1>
            <div>
                <p>Username: {session.data && session.data.user && session.data.user.name}</p>
                <p>Email: {session.data && session.data.user && session.data.user.email}</p>
            </div>
        </div>
    )
}