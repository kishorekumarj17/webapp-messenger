import React , { useState, useEffect }from "react";
import image from '../img_avatar.png';
import { getDoc, doc } from "firebase/firestore";
import { auth, firestoredb } from "../firebase";
const Profile=()=>{
    const [user, setUser] = useState({name:'',email:'',createdAt:''});
    useEffect(() => {
        getDoc(doc(firestoredb, "users", auth.currentUser.uid)).then((docSnap) => {
          if (docSnap.exists) {
            setUser(docSnap.data());
            console.log(docSnap)
          }
        });
      });

    return (
        <section>
            <div className="profile_container">
                <div className="img_container">
                    <img src={image} alt="profileicon"/>
                </div>
                <div className="text_container">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    
                </div>
            </div>
        </section>
    )
}

export default Profile;