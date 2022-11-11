import React from "react";

const MessageInput=({handleSubmit,text,setText})=>{
    const handleform=(e)=>{
        e.preventDefault();
        handleSubmit(e);
    }
    return(
        <form className="message_form"onSubmit={handleform}>
            <div>
                <input type="text" placeholder="Enter Message" value={text} onChange={(e)=>setText(e.target.value)}/>
            </div>
            <div>
                <button className="btn">Send</button>
            </div>
        </form>
    )
}

export default MessageInput