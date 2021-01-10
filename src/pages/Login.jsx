import React from 'react'
import { actionTypes } from '../contexts/reducer';
import { useStateContext } from '../contexts/StateProvier';
import { auth, db, provider } from '../utils/firebase';
import { createDocument } from '../utils/dbutils';
import firebase from 'firebase'
import './Login.css'

function Login() {
    const [, dispatch] = useStateContext();

    const handleGoogleSignIn = () => {
        auth.signInWithPopup(provider).then((result) => {
            const user = result.user;

            // New Registrations 
            if (result.additionalUserInfo.isNewUser) {
                const chatDoc = {
                    members: ["chatbot", user.uid],
                    started_by: "chatbot",
                    started_at: firebase.firestore.FieldValue.serverTimestamp()
                }

                // New user object
                const newUser = {
                    user_id: user.uid,
                    display_name: user.displayName,
                    email: user.email,
                    email_verified: user.emailVerified,
                    photo_url: user.photoURL,
                    conversations: []
                };

                // Create a new conversation document
                createDocument("chats", chatDoc, id => {
                    // Add chatId to userObject
                    newUser.conversations.push(id);

                    // Update chatbot conversation data
                    db.collection("users").doc("chatbot").get().then(userDoc => {
                        const userJsonData= userDoc.data().conversations || [];
                        userJsonData.push(id);
                        userDoc.ref.set({conversations: userJsonData}, {merge: true});
                    });

                    // Create new user Data
                    db.collection("users").doc(user.uid).set(newUser).then(
                        // Dispatch Login
                        dispatch({type: actionTypes.SET_USER, user: newUser})
                    );

                    // Add default Message
                    db.collection("chats").doc(id).collection("messages").add({
                        author_id: "chatbot",
                        author_name: "ChatBot",
                        message: "Welcome, my friend. Feeling lonely here? Ask me something",
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    });

                })

            }
            else {
                db.collection("users").doc(user.uid).get().then(doc => {
                    dispatch({type: actionTypes.SET_USER, user: doc.data()});
                });
            }
            
        }).catch((err) => 
            alert(err.message)
        );
    };

    return (
        <div className="login">
            <div className="login__body">
                <img alt="Chat Application" src="https://i.imgur.com/uUqkiYo.png"/>
                <div className="login__text">
                    <h1>Chat App</h1>
                </div>
                <div className="google-btn"
                    onClick={handleGoogleSignIn}>
                    <div className="google-icon-wrapper">
                        <img alt="google-icon" className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                    </div>
                    <p className="btn-text">
                        <b>Sign in with google</b>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
