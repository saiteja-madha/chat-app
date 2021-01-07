import React, { useState, useEffect } from "react";
import SideBarChat from './SideBarChat'
import { useStateContext } from '../contexts/StateProvier'
import { db } from '../utils/firebase'
import "./SideBar.css";

// Material UI
import { Avatar, Button, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';

function SideBar() {
    const [isChatRoom, setIsChatRoom] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [dms, setDms] = useState([]);
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
        const unsubscribe = db.collection("users").doc(user.user_id).collection("private_rooms").onSnapshot(snapshot => {
            setDms(snapshot.docs.map(doc => ({id: doc.data().id, name:doc.data().name})))
        })
        return () => {
            unsubscribe();
        }
        
    }, [user])

    const handleButtonClick = () => {
        const name = prompt("Please enter name for chat room")
        if (name) {
            db.collection("rooms").add({name: name});
        }
    }

    const handleToggle = () => {
        setIsChatRoom(prev => !prev);
    }

    return (
        <div className="sidebar__wrapper">
            <div className="sidebar">
                <div className="sidebar__header">
                    <Avatar src={
                        user ? user.photo_url : ""
                    }/>
                    <div className="sidebar__headerRight">
                        <IconButton onClick={handleToggle}>
                            {isChatRoom ? <ToggleOffIcon /> : <ToggleOnIcon/>}
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
                    {isChatRoom ? (rooms.map(room => 
                        <SideBarChat key={room.id}
                            id={room.id}
                            name={room.data.name}
                        />)) 
                        : 
                    (dms.map(dms => 
                        <SideBarChat key={dms.id}
                            id={dms.id}
                            name={dms.name}
                        />)) 
                    } 
                </div>
            </div>
        </div>
    )
}

export default SideBar
