"use client"
import styles from "./userAction.module.css"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import CustomForm from "../Form/form"
import CustomInput from "../Input/input"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
export default function UserAction() {
    const userActionRef = useRef(null)
    const session = useSession()
    const [available, setAvailable] = useState(false)
    if (session.status === 'unauthenticated') {
        return false
    }
    if (session.status === 'authenticated') {
        if (!session.data.user.pending)
            return false
    }
    console.log(session)
    const router = useRouter()
    const handleSubmit = async (e) => {
        if(!available)
            return
        e.preventDefault()
        const formd = new FormData(e.target)
        const entries = Object.fromEntries(formd.entries())

        const response = await fetch('/api/newuser', {
            method: 'POST',
            body: JSON.stringify({
                username: entries.username,
                email: email
            }),
            credentials: 'include'
        })
        if (response.ok) {
            router.push('/')
        }
    }

    const handleKeypress = async (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        const response = await fetch('/api/usernamecheck', {
            method: 'POST',
            body: JSON.stringify({
                username: e.target.value
            }),
            credentials: 'include'
        })
        if (response.ok){
            console.log("available")
            setAvailable(true)
        }
        else
            setAvailable(false)
    }
    return (
        <>
            {!(session.status === 'loading') &&
                <div className={styles.useraction} ref={userActionRef}>
                    <CustomForm onSubmit={handleSubmit}>
                        <h2>You need to choose a username before you proceed</h2>
                        {session.data && <p>Email: {session.data.user.email}</p>}
                        <CustomInput
                            className = {available ? styles.available : styles.unavailable}
                            type="text"
                            maxlength="8"
                            required
                            inputheading="username"
                            name="username"
                            onInput={handleKeypress}
                        />
                        {available && <input type="submit" />}
                    </CustomForm>
                    <button onClick={() => signOut()}>LOG out</button>
                </div>
            }
        </>
    )
}