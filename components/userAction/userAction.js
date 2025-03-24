"use client"
import { useRouter } from "next/navigation"
import CustomForm from "../Form/form"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import CheckUserInput from "../checkUserInput/checkuserinput"
import { Button } from "@/components/ui/button"
export default function UserAction() {

    const session = useSession();
    const router = useRouter()
    
    const handleSubmit = async (e) => {
        if(e.target.username.value.length < 3){
            return
        }
        e.preventDefault()
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
    console.log(session)
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
                        <CheckUserInput />
                        <Button type="submit">Submit</Button>
                        <Button onClick={() => signOut()}>LOG out</Button>
                    </CustomForm>
                </div>
            }
        </>
    )
}