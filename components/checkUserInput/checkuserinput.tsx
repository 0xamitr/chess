"use client"
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react";

export default function CheckUserInput() {
    const inputref = useRef<HTMLInputElement>(null); // Explicitly define the type
    const session = useSession();
    const [available, setAvailable] = useState(false)
    const [errormessage, setErrormessage] = useState("")
    const [username, setUsername] = useState("")

    useEffect(() => {
        if (username.length < 3) {
            setAvailable(false)
            setErrormessage("Username must be atleast 3 characters long")
            return
        }
        if (!(/^[a-zA-Z0-9]+$/.test(username))) {
            setAvailable(false)
            setErrormessage("Only alphanumeric characters are allowed")
            return
        }
        const delay = setTimeout(async () => {
            console.log("fetching.......", username)
            const response = await fetch('/api/usernamecheck', {
                method: 'POST',
                body: JSON.stringify({
                    username: username
                }),
                credentials: 'include'
            })
            if (response.ok) {
                setAvailable(true)
                setErrormessage("")
            }
            else {
                setAvailable(false)
                setErrormessage("Username is already taken")
            }
        }, 200)
        return () => clearTimeout(delay)
    }, [username])

    const handleKeypress = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value)
        setUsername(e.currentTarget.value)
    }

    return (
        <Input
            className={available ? "focus-visible:ring-green-300" : "focus-visible:ring-red-400"}
            ref={inputref}
            placeholder="Username"
            type="text"
            name="username"
            required
            minLength={4}
            maxLength={20}
            onChange={handleKeypress}
        />
    )
}