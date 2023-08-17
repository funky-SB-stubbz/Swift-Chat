import { useState } from "react"
import axios from "axios";
import {UserContext} from './UserContext.jsx';
import {useContext } from "react";

export default function  RegisterAndLoginForm(params) {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [isLoginOrRegister,setIsLoginOrRegister]=useState('register')
    const {setUsername:setLoggedInUsername,setId}=useContext(UserContext)

    
    async function handleSubmit(ev){
        ev.preventDefault();
        const url = isLoginOrRegister==='register'?'/register':'/login'
       const {data}= await axios.post(url,{username,password});
       setLoggedInUsername(username);
       setId(data.id)
       console.log('post request sent using axios')
       console.log(`current logged in user is ${username}`)
    }
   return (
   <div className='bg-blue-50 h-screen flex items-center'>
    <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input value= {username} 
        onChange={ev=>{
            setUsername(ev.target.value)
            console.log(`user typed ${ev.target.value} in user name`)
        }}
        type="text" placeholder="username" className="block w-full rounded-sm p-2 mb-2 border"/>
        <input 
        value={password}
        onChange={ev=>{
            setPassword(ev.target.value)
            console.log('password set')
        }}
        type="password" placeholder="password" className="block w-full rounded-sm p-2 mb-2 border"/>
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2"> {
            isLoginOrRegister==='register'?'Register':'Login'
        }</button>
        {
            isLoginOrRegister==='register'?(<div className="text-center mt-2">
        Already have an account?
        <button onClick={()=>{
            setIsLoginOrRegister('login')
        }}>
            Login here
        </button>
        </div>):(<div className="text-center mt-2">
        Don't have an account?
        <button onClick={()=>{
            setIsLoginOrRegister('register')
        }}>
            Sign Up Here!
        </button>
        </div>

        )
        }
    </form>
   </div>
   )
}