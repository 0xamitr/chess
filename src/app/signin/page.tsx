"use client"
import { MouseEventHandler } from 'react'
import CustomForm from '../../../components/Form/form'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignIn() {
    const session = useSession()
    const router = useRouter()
    if (session.data) {
        router.push('/')
    }

    const handleG = async (e: any) => {
        e.preventDefault()
        try {
            const response = await signIn('google')
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const email = formData.get('email');
        const password = formData.get('password');
        console.log(email);

        try {
            const response = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password
            })
            if (response?.ok)
                router.push('/')
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <CustomForm onSubmit={handleSubmit}>
                <h2 className='text-xl mb-5'>SIGN IN</h2>
                <Input type='email' placeholder='Email' name='email' required />
                {/* <CustomInput 
                    inputheading="Email"
                    type="email"
                    name="email"
                    required="required"
                /> */}
                <Input type='password' placeholder='Password' name='password' minLength={8} maxLength={20} required />
                {/* <CustomInput 
                    inputheading="Password"
                    type="password"
                    name="password"
                    required="required"
                    minLength={8} 
                    maxLength={20}
                /> */}
                <Button type='submit'>Sign In</Button>
                {/* <input type='submit' /> */}
                <Button onClick={handleG}>Sign In with Google</Button>
                <Link href='signup' className='hover:underline'>Dont have an account? </Link>
            </CustomForm >
        </>
    )
}