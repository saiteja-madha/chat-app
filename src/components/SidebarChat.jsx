import React, { useEffect, useState } from 'react'
import { db } from '../utils/firebase';
import './SideBarChat.css'

// Material UI
import {Avatar} from '@material-ui/core'
import {Link} from 'react-router-dom'
import { useStateContext } from '../contexts/StateProvier';

function SideBarChat({ id }) {
    
    const [{ user },] = useStateContext();
    const [messages, setmessages] = useState("");
    const [chat, setChat] = useState(null);
    const [contactName, setContactName] = useState("");

    useEffect(() => {
        if (id) {
            db.collection("chats")
                .doc(id)
                .collection("messages")
                .orderBy("timestamp", "desc")
                .limit(1)
                .onSnapshot((snapshot) =>
                    setmessages(snapshot.docs.map((doc) => doc.data()))
                );

            db.collection("chats").doc(id.trim()).onSnapshot(snapshot => 
                setChat(snapshot.data())
            )
        }
    }, [id]);

    useEffect(() =>{
        if (chat) {
            const contactId = (chat.members[0] === user.user_id) ? chat.members[1] : chat.members[0];
            db.collection("users").doc(contactId.trim()).onSnapshot(snapshot => setContactName(snapshot.data().display_name));
        }
    }, [chat, user])

    return (
        <Link>
            <div className="sidebarChat">
                <Avatar className="sidebarChat__avatar"/>
                <div className="sidebarChat__content">
                    <div className="sidebarChat__topRow">
                        <div className="sidebarChat__author">
                            {contactName} 
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
        </Link>
    )
}

export default SideBarChat
