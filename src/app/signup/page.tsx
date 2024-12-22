"use client"
import CustomForm from '../../../components/Form/form'
import CustomInput from '../../../components/Input/input'
import { signOut } from 'next-auth/react'

export default  function SignUp(){
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const name = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        console.log(email);

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
    }
    return(
        <CustomForm onSubmit={handleSubmit}>
            <h2>SIGN UP</h2>
            <CustomInput 
                inputheading="Username"
                type="text"
                name="username"
                required="required"
                minLength={4} 
                maxLength={20}
            />
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
            <button onClick={() => signOut()}>LOG out</button>
        </CustomForm >
    )
}