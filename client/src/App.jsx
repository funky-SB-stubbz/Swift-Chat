import { useState } from 'react'
import { UserContextProvider } from './UserContext'
import axios from 'axios'
import Routes from './Routes'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  axios.defaults.baseURL='http://localhost:3000';
  axios.defaults.withCredentials=true;
  // const {username}=
  return (
    <>
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
  
    </>
  )
}

export default App
