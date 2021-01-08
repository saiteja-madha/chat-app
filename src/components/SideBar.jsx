import React, { useState, useEffect } from "react";
import SideBarChat from './SideBarChat'
import SideBarGroup from './SideBarGroup'
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
    const [groups, setGroups] = useState([]);
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
                setGroups(snapshot.data().groups)
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
                    {isChatRoom ? (rooms.map(room => 
                        <SideBarGroup key={room.id}
                            id={room.id}
                        />)) 
                        : 
                    (groups.map(group => 
                        <SideBarChat key={group}
                            id={group}
                        />)) 
                    }
                </div>
            </div>
        </div>
    )
}

export default SideBar
