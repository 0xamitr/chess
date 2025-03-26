"use client"
import { useRouter } from "next/navigation"
import CustomForm from "../Form/form"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import CheckUserInput from "../checkUserInput/checkuserinput"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function UserAction() {
    const session = useSession();
    const router = useRouter()
    const [userExists, setUserExists] = useState("")

    const handleSubmit = async (e) => {
        if (e.target.username.value.length < 4) {
            toast('Username iSs too short')
            return
        }
        e.preventDefault()
        if(userExists != 'false'){
            toast('Username is taken')
            return
        }
        const formd = new FormData(e.target)
        const entries = Object.fromEntries(formd.entries())
        const email = session.data.user.email
        const response = await fetch('/api/newuser', {
            method: 'POST',
            body: JSON.stringify({
                username: entries.username,
                email: email,
                img: session.data.user.image,
                pending: session.data.user.pending
            }),
            credentials: 'include'
        })
        if (response.ok) {
            const resolve = await response.json()
            await session.update({
                pending: false,
                name: entries.username,
                id: resolve.data._id,
                user: { ...session.data.user, pending: false }
            });
            router.push('/')
        }
    }

    if (session.status === 'unauthenticated') {
        return null
    }
    if (session.status === 'authenticated') {
        if (!session.data.user.pending)
            return null
    }

    return (
        <>
            {!(session.status === 'loading') &&
                <div className="absolute bg-white z-10 min-w-[100vw] min-h-[100vh]">
                    <CustomForm onSubmit={handleSubmit}>
                        <h2>You need to choose a username before you proceed</h2>
                        {session.data && <p>Email: {session.data.user.email}</p>}
                        <CheckUserInput
                            className={userExists == 'true' || userExists == 'invalid' ? "focus-visible:ring-red-300" : "focus-visible:ring-green-300"}
                            userExists={userExists} setUserExists={setUserExists}/>
                        <p className= "pl-2 text-gray-600 text-sm">
                            {userExists == 'true' ? "Username already exists" : userExists == 'invalid' ? "Invalid username" : "Username Available"}
                        </p>
                        <Button type="submit">Submit</Button>
                        <Button onClick={() => signOut()}>LOG out</Button>
                    </CustomForm>
                </div>
            }
        </>
    )
}