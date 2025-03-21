"use client"
import CustomForm from '../../../components/Form/form'
import CustomInput from '../../../components/Input/input'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
export default  function SignUp(){
    const session = useSession()
    const router = useRouter()
    console.log(session)
    // if(session.data){
    //     router.push('/')
    // }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        e.stopPropagation()
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const name = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        const response = await fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok)
            router.push('/signin')
    }
    return(
        <CustomForm onSubmit={handleSubmit}>
            <h2>SIGN UP</h2>
            <Input type='text' placeholder='Username' name='username' minLength={4} maxLength={20} required/>
            {/* <CustomInput 
                inputheading="Username"
                type="text"
                name="username"
                required="required"
                minLength={4} 
                maxLength={20}
            /> */}
            <Input type='email' placeholder='Email' name='email' required/>
            {/* <CustomInput 
                inputheading="Email"
                type="email"
                name="email"
                required="required"
            /> */}
            <Input type='password' placeholder='Password' name='password' minLength={8} maxLength={20} required/>
            {/* <CustomInput 
                inputheading="Password"
                type="password"
                name="password"
                required="required"
                minLength={8} 
                maxLength={20}
            /> */}
            <Button type='submit'>Sign Up</Button>
            <Button onClick={()=> signOut()}>Sign Out</Button>
        </CustomForm >
    )
}