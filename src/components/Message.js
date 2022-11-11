import React , {useEffect,useRef}from "react";
import Moment from "react-moment";
const Message=({msg,currentUser})=>{
    const scroll=useRef();
    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"}) 
    },[msg])

 return(
 <div className={`message_wrapper ${msg.from === currentUser ? "own" : ""}`} ref={scroll}>
   <p className={msg.from === currentUser ? "me" : "friend"}>
       {msg.text}
       <br/>
       <small>
           {/* <Moment fromNow={msg.createdAt.toDate()}/> */}
       </small>
   </p>
 </div>
 )
}

export default Message