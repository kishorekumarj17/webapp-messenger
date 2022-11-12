import React,{useContext} from "react";
import {auth,firestoredb} from '../firebase'
import { Link } from "react-router-dom";
import {signOut} from "firebase/auth"
import {updateDoc,doc} from 'firebase/firestore'
import { AuthContext } from "../auth";
import { useNavigate } from "react-router-dom";
const Navbar = ()=>{
    const navigate=useNavigate()
    const {user}=useContext(AuthContext)
    const handleLogOut= async ()=>{
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
        await signOut(auth)    
        navigate('/login')
    }
    
    return (
        <nav>
            <h3>
                <Link to="/">Messenger App</Link>
            </h3>
            <div>
                {
                    user ? 
                    <>
                    <Link to="/profile">My Details</Link>
                    <button className="btn" onClick={handleLogOut}>Logout</button>
                    </>
                    :
                    <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                    </>
                }
                
            </div>
        </nav>
    )
}

export default Navbar