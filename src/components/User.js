import React, {useEffect,useState} from "react";
import image from '../img_avatar.png'
import { onSnapshot,doc } from "firebase/firestore";
import { firestoredb } from "../firebase";
const User = ({user,selectUser,currentUser,chat})=>{
    const toUser=user.uid
    const [data,setData]=useState("")
    const id= currentUser>toUser ? `${currentUser+toUser}`: `${toUser+currentUser}`
    
    useEffect(()=>{
        let unsubscribe=onSnapshot(doc(firestoredb,'lastMessage',id),(doc)=>{
            setData(doc.data())
        })
        return ()=> unsubscribe();
    },[])
   
    return ( 
        <>
        <div className={`user_wrapper ${chat.uid===user.uid && "selected_user"}`} onClick={()=>selectUser(user)}>
        <div className="user_wrapper">
            <div className="user_info">
                <div className="user_detail">
                    <img src={image} alt="user_icon" className="avatar"/>
                    <h4>{user.name}</h4>
                    {data?.from !== currentUser && data?.unRead && (
              <small className="unread">New</small>
            )}
                </div>
                <div className={`user_status ${user.isOnline ? 'online': 'offline'}`}></div>
            </div>
            {data && <p className="truncate">
                <strong>{data.from===currentUser? "You:":null}</strong>
                {data.text}</p>}
        </div>
        </div>
    <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.uid === user.uid && "selected_user"}`}
      >
        <img
          src={image}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
      </>
    )
}

export default User;