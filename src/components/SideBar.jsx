import React, { useState, useEffect } from "react";
import SideBarChat from './SideBarChat'
import SideBarGroup from './SideBarGroup'
import { useStateContext } from '../contexts/StateProvier'
import { db } from '../utils/firebase'
import firebase from 'firebase'
import "./SideBar.css";

// Material UI
import { Avatar, Button, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

function SideBar() {
    const [rooms, setRooms] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [{ user },] = useStateContext();

    useEffect(() => {
        const unsubscribe = db.collection("rooms").onSnapshot(snapshot => {
            setRooms(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})))
        })
        return() => {
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        const unsubscribe = db.collection("users")
            .doc(user.user_id)
            .onSnapshot(snapshot => {
                setConversations(snapshot.data()?.conversations)
            })

        return () => {
            unsubscribe();
        }
        
    }, [user])

    const handleNewGroup = () => {
        const name = prompt("Please enter name for chat room")
        if (name) {
            db.collection("rooms").add({name: name});
        }
    }

    const handleNewChat = () => {
        const email = prompt("Please enter recepient's email to start a conversation")
        if (email) {
            db.collection("users").where("email", "==", email).limit(1).get()
            .then(snap => {
                if (snap.empty) {
                    alert("No Matching users found!")
                } else {
                    snap.forEach(targetDoc => {
                        db.collection("chats").add({
                            members: [user.user_id, targetDoc.data().user_id],
                            started_by: user.user_id,
                            started_at: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(createdDoc => {
                            const targetJsonData= targetDoc.data().conversations || []
                            targetJsonData.push(createdDoc.id)
                            targetDoc.ref.set({conversations: targetJsonData}, {merge: true});
                            db.collection("users").doc(user.user_id).get().then(userDoc => {
                                const userJsonData= userDoc.data().conversations || [];
                                userJsonData.push(createdDoc.id);
                                userDoc.ref.set({conversations: userJsonData}, {merge: true});
                            });
                        })

                    })
                }
            });
        }
    }

    return (
        <div className="sidebar__wrapper">
            <div className="sidebar">
                <div className="sidebar__header">
                    <Avatar src={
                        user ? user.photo_url : ""
                    }/>
                    <div className="sidebar__headerRight">
                        <IconButton>
                            <MoreVertIcon className="sidebar__iconBtn"/>
                        </IconButton>
                    </div>
                </div>
                <div className="sidebar__newRoom" onClick={handleNewChat}>
                    <Button variant="contained" color="primary">
                        New conversation
                    </Button>
                </div>
                <div className="sidebar__chatMsgs">
                    {conversations?.map(group => 
                        <SideBarChat key={group}
                            id={group}
                        />)
                    }
                </div>
                <div className="sidebar__newRoom" onClick={handleNewGroup}>
                    <Button variant="contained" color="primary">
                        New chat-room
                    </Button>
                </div>
                <div className="sidebar__chatGroups">
                    { rooms?.map(room => 
                        <SideBarGroup key={room.id}
                            id={room.id}
                        />)
                    }
                </div>
            </div>
        </div>
    )
}

export default SideBar
