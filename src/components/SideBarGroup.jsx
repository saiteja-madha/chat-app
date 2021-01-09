import React, { useEffect, useState } from 'react'
import { db } from '../utils/firebase';
import './SideBarChat.css'

// Material UI
import {Avatar} from '@material-ui/core'
import { useStateContext } from '../contexts/StateProvier';
import { actionTypes } from '../contexts/reducer';

function SideBarChat({ id }) {
    const [, dispatch] = useStateContext();
    const [messages, setmessages] = useState("");
    const [room, setRoom] = useState(null);

    useEffect(() => {
        if (id) {
            db.collection("rooms")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .limit(1)
            .onSnapshot((snapshot) =>
                setmessages(snapshot.docs.map((doc) => doc.data()))
            );

            db.collection("rooms").doc(id).onSnapshot(snapshot => {
                setRoom(snapshot.data());
            })
        }
      }, [id]);

    const setConversation = () => {
        dispatch({
            type: actionTypes.SET_ROOMDATA,
            roomData: {
                id: id,
                type: 1,
            }
        })
    };

    return (
        <div className="sidebarChat" onClick={setConversation}>
            <Avatar className="sidebarChat__avatar"/>
            <div className="sidebarChat__content">
                <div className="sidebarChat__topRow">
                    <div className="sidebarChat__author">
                        {room?.name} 
                    </div>
                    <div className="sidebarChat__lastSeen">
                        { messages.length === 0 ? '' : new Date(messages[messages.length - 1]?.timestamp?.toDate()).toDateString()}
                    </div>
                </div>
                <div className="sidebarChat__chat">
                {messages[0]?.message}
                </div>
            </div>
        </div>
    )
}

export default SideBarChat
