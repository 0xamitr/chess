"use client"
import CustomForm from '../../../components/Form/form'
import CustomInput from '../../../components/Input/input'

export default function SignUp(){
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const name = formData.get('username');
        const email = formData.get('email');
        console.log(email);
        const response = fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
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
            <input type='submit' />
        </CustomForm >
    )
}