import React, {useState, useEffect} from "react";

import "./MobileSidebar.css";
import {useStateContext} from '../contexts/StateProvier'

// Material UI
import {Avatar, Divider, IconButton} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";

// Utils
import {db} from '../utils/firebase'
import SideBarChat from "./SideBarChat";

function MobileSideBar() {
    const [isChatRoom, setIsChatRoom] = useState(true);
    const [rooms, setRooms] = useState([]);

    const [
        {
            user
        },
    ] = useStateContext();

    useEffect(() => {
        const unsubscribe = db.collection("rooms").onSnapshot(snapshot => {
            setRooms(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})))
        })
        return() => {
            unsubscribe()
        }
    }, [])

    const handleButtonClick = () => {
        const name = prompt("Please enter name for chat room")

        if (name) {
            db.collection("rooms").add({name: name});
        }
    }

    const handleSwitch = () => {
        setIsChatRoom(prev => !prev);
    }

    return (
        <div className="mobileSidebar__wrapper">
            <div className="mobileSidebar">
                <div className="mobileSidebar__header">
                    <Avatar src={
                        user ? user.photoURL : ""
                    }/>
                    <div className="mobileSidebar__headerRight">
                        <IconButton>
                            <DonutLargeIcon onClick={handleSwitch}
                                className="mobileSidebar__iconBtn"/>
                        </IconButton>
                        <IconButton>
                            <ChatIcon className="mobileSidebar__iconBtn"/>
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon className="mobileSidebar__iconBtn"/>
                        </IconButton>
                    </div>
                </div>
                <Divider />
                <div className="sidebar__newRoom" onClick={handleButtonClick}>
                    <Button variant="contained" color="primary">
                        {`${isChatRoom ? 'New chat-room' : 'New conversation'}`} 
                    </Button>
                </div>
                <div className="mobileSidebar__chatGroups">
                    {
                    isChatRoom ? (rooms.map(room => 
                        <SideBarChat key={room.id}
                            id={room.id}
                            name={room.data.name}/>)) 
                        : 
                        (<div>Hello</div>)
                } </div>
            </div>
        </div>
    )
}

export default MobileSideBar
