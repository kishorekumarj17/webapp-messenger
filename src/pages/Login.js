import React,{useState} from "react";
import {auth,firestoredb} from '../firebase'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {doc,updateDoc} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
const Login = ()=>{
    const [data,setData]=useState({email:'',password:'',error:null,loading:false})
    const {email,password,error,loading}=data;
    const handleChange=(event)=>{
        setData({...data,[event.target.name]:event.target.value})
    }
    const navigate=useNavigate()
    const handleSubmit=async (event)=>{
        event.preventDefault();
        setData({...data,error:null,loading:true})
        if( email==="" || password===""){
            setData({...data,error:'Datas are missing for few fields'})
        }
        else
        {
            try{
            const res= await signInWithEmailAndPassword(auth,email,password)
            await updateDoc(doc(firestoredb,'users',res.user.uid),
            {
                isOnline:true,  
            })
            setData({email:'',password:'',error:null,loading:false})
            navigate('/');
            }
            catch(err)
            {
                setData({...data,error:err.message,loading:false})
            }
        }
    }

    return (
        <section>
            <h3>Login</h3>
            <form className="form" onSubmit={handleSubmit}>
                
                <div className="input_container">
                    <label htmlFor="email">*Email</label>
                    <input type="text" name="email" value={email} onChange={handleChange}/>
                </div>
                <div className="input_container">
                    <label htmlFor="password">*Password</label>
                    <input type="password" name="password" value={password} onChange={handleChange}/>
                </div>
                {error?<p className="error">{error}</p>:null}
                <div className="btn_container">
                    <button className="btn" disabled={loading}>{loading?'Please wait..':'Login'}</button>
                </div>
            </form>
        </section>
    )
}

export default Login