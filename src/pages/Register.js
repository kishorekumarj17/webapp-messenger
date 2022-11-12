import React,{useState} from "react";
import {auth,firestoredb} from '../firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {setDoc,doc,Timestamp} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
const Register = ()=>{
    const [data,setData]=useState({name:'',email:'',password:'',error:null,loading:false})
    const {name,email,password,error,loading}=data;
    const handleChange=(event)=>{
        setData({...data,[event.target.name]:event.target.value})
    }
    const navigate=useNavigate()
    
    const handleSubmit=async (event)=>{
        event.preventDefault();
        setData({...data,error:null,loading:true})
        if(name==="" || email==="" || password===""){
            setData({...data,error:'Datas are missing for few fields'})
        }
        else
        {
            try{
            const res= await createUserWithEmailAndPassword(auth,email,password)
            await setDoc(doc(firestoredb,'users',res.user.uid),
            {
                uid:res.user.uid,
                name,email,
                isOnline:true,
                createdAt:Timestamp.fromDate(new Date())
            })
            setData({name:'',email:'',password:'',error:null,loading:false})
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
            <h3>Create An Account</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="name">*Name</label>
                    <input type="text" name="name" value={name} onChange={handleChange}/>
                </div>
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
                    <button className="btn" disabled={loading}>{loading?'Please wait..':'Register'}</button>
                </div>
            </form>
        </section>
    )
}

export default Register