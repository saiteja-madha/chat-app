import React, { useEffect, useState } from 'react'
import { db } from '../utils/firebase';
import './SidebarChat.css'

// Material UI
import {Avatar} from '@material-ui/core'
import {Link} from 'react-router-dom'

function SidebarChat({id, name}) {

    const [messages, setmessages] = useState("");

    useEffect(() => {
        if (id) {
          db
            .collection("rooms")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
              setmessages(snapshot.docs.map((doc) => doc.data()))
            );
        }
      }, [id]);

    return (
        <Link className={{
            color: 'inherit',
            textDecoration: 'none',
          }} to={
            `/rooms/${id}`
        }>
            <div className="sidebarChat">
                <Avatar className="sidebarChat__avatar"/>
                <div className="sidebarChat__content">
                    <div className="sidebarChat__topRow">
                        <div className="sidebarChat__author">
                            {name} </div>
                        <div className="sidebarChat__lastSeen">
                        { messages.length === 0 ? '' : new Date(messages[messages.length - 1]?.timestamp?.toDate()).toDateString()}
                        </div>
                    </div>
                    <div className="sidebarChat__chat">
                    {messages[0]?.message}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SidebarChat
