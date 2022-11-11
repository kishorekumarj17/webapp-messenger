import React,{useEffect,useState} from "react";
import { firestoredb,auth } from "../firebase";
import { collection,query,where,onSnapshot,addDoc, Timestamp, orderBy,setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import User from "../components/User";
import MessageInput from "../components/MessageInput";
import Message from "../components/Message";

const Home = ()=>{
    const [users,setUsers]=useState([])
    const[chat,setChat]=useState('');
    const[text,setText]=useState('');
    const [messages,setMessages]=useState([])
    const currentUser=auth.currentUser.uid
    useEffect(()=>{
        const userref=collection(firestoredb,'users')
        const q=query(userref,where('uid','not-in',[currentUser]))
        const unsubscribe=onSnapshot(q,querySnapshot=>{
            let users=[]
            querySnapshot.forEach((doc)=>{
                users.push(doc.data())
            })
            setUsers(users);
        })
        return ()=> unsubscribe();
    },[])
    const selectUser = async (user)=>{
        
        setChat(user)
        const toUser=user.uid;
        const id= currentUser>toUser ? `${currentUser+toUser}`: `${toUser+currentUser}`
        const messagesRef=collection(firestoredb,'messages',id,'chat')
        const q=query(messagesRef,orderBy('createdAt',"asc"))
        onSnapshot(q,querySnapshot=>{
            let messages=[]
            querySnapshot.forEach((doc)=>{
                messages.push(doc.data())
            })
            setMessages(messages)
        })

        const docSnap=await getDoc(doc(firestoredb,'lastMessage',id))
        if(docSnap.data() && docSnap.data().from!== currentUser)
        {
            await updateDoc(doc(firestoredb,'lastMessage',id),{unRead:false})
        }
    }

   
    const handleSubmit = async (e)=>{
       
        e.preventDefault()
        const toUser = chat.uid;
        const id= currentUser>toUser ? `${currentUser+toUser}`: `${toUser+currentUser}`
        await addDoc(collection(firestoredb,"messages",id,"chat"),{
            text,
            from:currentUser,
            to:toUser,
            createdAt:Timestamp.fromDate(new Date())
        })

        await setDoc(doc(firestoredb,'lastMessage',id),{
            text,
            from:currentUser,
            to:toUser,
            createdAt:Timestamp.fromDate(new Date()),
            unRead:true
        })
        setText("");
    }

    return (
        <div className="home_container">
            <div className="users_container">
                {users.map(user=><User key={user.uid} user={user} selectUser={selectUser} chat={chat} currentUser={currentUser} />)}
            </div>
            <div className="messages_container">
                {chat ? 
                <>
                <div className="messages_user">
                    <h3>{chat.name}</h3>
                </div>
                <div className="messages">
                    {messages.length?messages.map((msg,i)=><Message key={i} msg={msg} currentUser={currentUser}/>):null}
                </div>
                <MessageInput handleSubmit={handleSubmit} text={text} setText={setText}/>
                </>
                :<h3 className="no_conv">Choose a conversation</h3>}
            </div>
        </div>
    )
}

export default Home