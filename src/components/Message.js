import React , {useEffect,useRef}from "react";
import Moment from "react-moment";
const Message=({msg,currentUser,chat})=>{
    const scroll=useRef();
    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"}) 
    },[msg])

 return(
 <div className={`message_wrapper ${msg.from === currentUser ? "own" : ""}`} ref={scroll}>
   <p className={msg.from === currentUser ? "me" : "friend"}>
       {msg.text}
       
       
           {/* <Moment fromNow={msg.createdAt.toDate()}/> */}
           <span style={{float:'right'}}>
           {(msg.messageStatus==="sent" && msg.from===currentUser)? <small>&#10003;</small>:null}
           {(msg.messageStatus==="delivered" && msg.from===currentUser)? <small>&#10003;&#10003;</small>:null}
           {(msg.messageStatus==="read" && msg.from===currentUser)? <small style={{color:'black'}}>&#10003;&#10003;</small>:null}
           </span>
   </p>
 </div>
 )
}

export default Message