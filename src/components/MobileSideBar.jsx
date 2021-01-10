import React, {useState, useEffect} from "react";
import {useStateContext} from '../contexts/StateProvier'
import SideBarChat from "./SideBarChat";
import SideBarGroup from "./SideBarGroup";
import "./MobileSidebar.css";

// Material UI
import { Avatar, Button, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';

// Utils
import {db} from '../utils/firebase'
import firebase from 'firebase'

function MobileSideBar() {
    const [isChatRoom, setIsChatRoom] = useState(true);
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

    const handleButtonClick = () => {
        if (isChatRoom) {
            const name = prompt("Please enter name for chat room")
            if (name) {
                db.collection("rooms").add({name: name});
            }
        } else {
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
    }

    const handleToggle = () => {
        setIsChatRoom(prev => !prev);
    }

    return (
        <div className="mobileSidebar__wrapper">
            <div className="sidebar">
                <div className="sidebar__header">
                    <Avatar src={
                        user ? user.photo_url : ""
                    }/>
                    <div className="sidebar__headerRight">
                        <IconButton onClick={handleToggle}>
                            {isChatRoom ? <ToggleOffIcon className="sidebar__iconBtn"/> : <ToggleOnIcon className="sidebar__iconBtn"/>}
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon className="sidebar__iconBtn"/>
                        </IconButton>
                    </div>
                </div>
                <div className="sidebar__newRoom" onClick={handleButtonClick}>
                    <Button variant="contained" color="primary">
                        {`${isChatRoom ? 'New chat-room' : 'New conversation'}`} 
                    </Button>
                </div>
                <div className="sidebar__chatGroups">
                    {isChatRoom ? (rooms?.map(room => 
                        <SideBarGroup key={room.id}
                            id={room.id}
                        />)) 
                        : 
                    (conversations?.map(group => 
                        <SideBarChat key={group}
                            id={group}
                        />)) 
                    }
                </div>
            </div>
        </div>
    )
}

export default MobileSideBar
