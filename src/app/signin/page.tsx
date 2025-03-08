"use client"
import CustomForm from '../../../components/Form/form'
import CustomInput from '../../../components/Input/input'
import { signIn, signOut, useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'

export default  function SignIn(){
    const session = useSession()
    const router = useRouter()
    console.log(session)
    if(session.data){
        router.push('/')
    }

    const handleG = async() =>{
        try{
            console.log("what")
            const response = await signIn('google')
        }
        catch(error){
            console.log(error)
        }
    }
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const email = formData.get('email');
        const password = formData.get('password');
        console.log(email);

        try{
            const response = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password
            })
            if(response?.ok)
                router.push('/')
        }
        catch(error){
            console.log(error)
        }
    }
    return(
        <>
            <CustomForm onSubmit={handleSubmit}>
                <h2>SIGN IN</h2>
                <CustomInput 
                    inputheading="Email"
                    type="email"
                    name="email"
                    required="required"
                />
                <CustomInput 
                    inputheading="Password"
                    type="password"
                    name="password"
                    required="required"
                    minLength={8} 
                    maxLength={20}
                />
                <input type='submit' />
                <div><p>Dont have an account? </p><a href='signup'>SignUp Now!</a></div>
            </CustomForm >
            <button onClick={handleG}>Sign In with Google</button>
        </>
    )
}