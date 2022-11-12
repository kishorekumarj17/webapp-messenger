import React,{useEffect,useState} from "react";
import { firestoredb,auth } from "../firebase";
import { collection,query,where,onSnapshot,addDoc, Timestamp, orderBy,setDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import User from "../components/User";
import MessageInput from "../components/MessageInput";
import Message from "../components/Message";
import { async } from "@firebase/util";

const Home = ()=>{
    const [users,setUsers]=useState([])
    const[chat,setChat]=useState('');
    const[text,setText]=useState('');
    const [messagesObj,setMessagesObj]=useState({})
    const currentUser=auth.currentUser.uid
    const [windowStatus,setWindowStatus]=useState('blur')
    
const onFocus = async () => {
   setWindowStatus('focus')
   try
   {
       await updateDoc(doc(firestoredb,'users',auth.currentUser.uid),{
           isOnline:true
       })
   }
   catch(err)
   {
       console.log(err)
   }
};

const readRecipients=async (key)=>{
    
    const toUser=key;
    const id= currentUser>toUser ? `${currentUser+toUser}`: `${toUser+currentUser}`
    
    const messagesRef=collection(firestoredb,'messages',id,'chat')
    const q=query(messagesRef,orderBy('createdAt',"asc"))
    
    await getDocs(q).then((querySnapshot)=>{
        querySnapshot.forEach(async (document)=>{
        
            if(document && windowStatus==="focus" && document.data().to===currentUser && document.data().messageStatus!=="read" && document.data().messageStatus==="delivered")
            {
                await updateDoc(doc(firestoredb,'messages',id,'chat',document.id),{
                    messageStatus:'read'
                })
            }
        })
    })
}

const onBlur = async () => {
    setWindowStatus('blur')
    try
    {
        await updateDoc(doc(firestoredb,'users',auth.currentUser.uid),{
            isOnline:false
        })
    }
    catch(err)
    {
        console.log(err)
    }
};

    useEffect(()=>{

        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        onFocus();
       
        const userref=collection(firestoredb,'users')
        const q=query(userref,where('uid','not-in',[currentUser]))
        const unsubscribe=onSnapshot(q,querySnapshot=>{
            let users=[]
            querySnapshot.forEach((doc)=>{
                users.push(doc.data())
            })
            setUsers(users);
        })
        return ()=> {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
            unsubscribe();
        };
    },[])
    
    const selectUser = async (user)=>{
        
        await setChat(user)
        
        const toUser=user.uid;
        const id= currentUser>toUser ? `${currentUser+toUser}`: `${toUser+currentUser}`
        const messagesRef=collection(firestoredb,'messages',id,'chat')
        const q=query(messagesRef,orderBy('createdAt',"asc"))
       
        await onSnapshot(q,querySnapshot=>{
            let messages=[]
            
            querySnapshot.forEach(async (document)=>{
            
                messages.push(document.data())
                
            })
            setMessagesObj({...messagesObj,[toUser]:messages})
          
        })
        

        await getDocs(q).then((querySnapshot)=>{
            querySnapshot.forEach(async (document)=>{
            
                if(document && document.data().to===currentUser && document.data().messageStatus!=="read")
                {
                    await updateDoc(doc(firestoredb,'messages',id,'chat',document.id),{
                        messageStatus:'read'
                    })
                }
            })
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
            createdAt:Timestamp.fromDate(new Date()),
            messageStatus:'sent'
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
                {Object.keys(messagesObj).map((key)=>{
                    readRecipients(chat.uid);
                   return (<div className="messages" key={key} style={{display:(chat.uid===key)?'block':'none'}}>
                        {messagesObj[key].length?messagesObj[key].map((msg,i)=><Message key={i} msg={msg} currentUser={currentUser} chat={chat}/>):null}
                    </div>)}
                )}

                {/* <div className="messages">
                    {messages.length?messages.map((msg,i)=><Message key={i} msg={msg} currentUser={currentUser} chat={chat}/>):null}
                </div> */}
                <MessageInput handleSubmit={handleSubmit} text={text} setText={setText}/>
                </>
                :<h3 className="no_conv">Choose a conversation</h3>}
            </div>
        </div>
    )
}

export default Home