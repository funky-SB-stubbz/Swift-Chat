import { useState,useEffect, useContext } from "react"
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
export default function Chat(){
    const [ws,setWs]= useState(null);
    const [onlinePeople,setOnlinePeople]=useState({})
    const [selectedUserId,setSelectedUserId]= useState(undefined)
    const {username,id}=useContext(UserContext)
    const [newMessageText,setNewMessageText]=useState(undefined)
    const [messages,setMessages]=useState([])

    //>
    useEffect(()=>{
        const ws=new WebSocket('ws://localhost:3000');
        setWs(ws);
        ws.addEventListener('message',handleMessage)
    },[]);


    function showOnlinePeople(peopleArray){
        const people = {};
        peopleArray.forEach(({userId,username})=>{
            people[userId]=username;
        });
        console.log(people)
        setOnlinePeople(people);
    }

    function sendMessage(ev){
        ev.preventDefault();
        // const {data}= await axios.post('/new-message',{newMessageText})
        ws.send(JSON.stringify(
            {   
                sender:username,
                recipient: selectedUserId,
                text: newMessageText,
                
            }
        ))
        // console.log(`new message sent from ${username} to ${onlinePeople[selectedUserId]}`)
        console.log(messages)
        const messageList=[...messages,{recipient:selectedUserId,text:newMessageText,isOurs:true}]
        setNewMessageText('')
        setMessages(messageList)

    }



    function handleMessage(ev){
        // console.log('new message hoooray', e);
        const messageData= JSON.parse(ev.data);
        // console.log('This is message data',messageData);
        if('online' in messageData){
            showOnlinePeople(messageData.online)
        }

        if('text' in messageData){
            const receivedList=[...messages,{sender:messageData.sender,recipient:messageData.recipient,text:messageData.text,isOurs:false}]
            setMessages(receivedList);
            // console.log(messages)
            console.log(messageData)
        }
    }


    const onlinePeopleExclOurUser={...onlinePeople};
    delete onlinePeopleExclOurUser[id];
    // onlinePeople.filter((p=>p.username!==username))


    return (
        <div className="flex h-screen">
            <div className="bg-blue-50 w-1/3 ">
            <Logo/>
                {Object.keys(onlinePeopleExclOurUser).map(userId=>
                    (
                    <div className={"border-b border-gray-200  flex items-center gap-2 cursor-pointer "+(userId===selectedUserId?'bg-blue-200':'')}
                    onClick={()=>setSelectedUserId(userId)}
                    key={userId}>
                    {
                        (userId===selectedUserId)&&(
                            <div className="w-1 bg-blue-500 h-12"> </div>
                        )
                    }
                    <div className="py-2 pl-4 flex gap-2 items-center">
                    <Avatar username={onlinePeople[userId]} userId={userId}/>
                    <span className="text-gray-800">{onlinePeople[userId]}</span>
                    </div>
                    </div>
                )
                
                )}
            </div>
            <div className="flex flex-col bg-blue-100 w-2/3 p-2">
                <div className="flex-grow">
                    {
                        (!selectedUserId)&&(
                            <div className="flex h-full items-center justify-center">
                            <div className="text-gray-500">&larr; Select a Person</div> 
                            </div>
                        )
                        
                    }

                    {
                        !!selectedUserId && (
                            <div>{
                                messages.map(message=>(
                                    <div>{message.text}</div>
                                ))
                            }</div>
                        )
                    }


                </div>  
                {
                    (!!selectedUserId)&&(
                        <form className="flex gap-2" onSubmit={sendMessage}>
                    <input type="text"
                    value={newMessageText}
                    onChange={ev=>setNewMessageText(ev.target.value)}
                    placeholder="Type Your Message here" 
                    className="bg-white border flex-grow p-2 rounded-sm m-2"/>
                    <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
</svg>

                    </button>
                </form>
                    )
                }
            </div>
        </div>
    )
}