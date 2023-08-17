import { useState,createContext, useEffect} from "react"; //>
import axios from "axios";
//>
export const UserContext=createContext({})

export function UserContextProvider({children}){
    const [username,setUsername]= useState(null);
    const [id,setId]= useState(null);
    useEffect(()=>{
        axios.get('/profile',{withCredentials:true}).then(res=>{
            console.log(res.data)
            // response
            setId(res.data.userId)
            setUsername(res.data.username)
        })
    },[])
   return (
     <UserContext.Provider value={{username,setUsername,id,setId}}>
     {children}
     </UserContext.Provider>
   )
}