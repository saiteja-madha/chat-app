import React, { useEffect, useState } from 'react'
import { db } from '../utils/firebase';
import './SideBarChat.css'

// Material UI
import {Avatar} from '@material-ui/core'
import { useStateContext } from '../contexts/StateProvier';
import { actionTypes } from '../contexts/reducer';

function SideBarChat({ id }) {

    const [{ user }, dispatch] = useStateContext();
    const [messages, setmessages] = useState("");
    const [chat, setChat] = useState(null);
    const [contact, setContact] = useState("");

    useEffect(() => {
        if (id) {
            const unsubscribe1 = db.collection("chats")
                .doc(id)
                .collection("messages")
                .orderBy("timestamp", "desc")
                .limit(1)
                .onSnapshot((snapshot) =>
                    setmessages(snapshot.docs.map((doc) => doc.data()))
                );

            const unsubscribe2 = db.collection("chats").doc(id).onSnapshot(snapshot => setChat(snapshot.data()));

            return () => {
                unsubscribe1();
                unsubscribe2();
            }
        }
    }, [id]);

    useEffect(() =>{
        if (chat) {
            const contactId = (chat.members[0] === user.user_id) ? chat.members[1] : chat.members[0];
            const unsubscribe = db.collection("users").doc(contactId.trim()).onSnapshot(snapshot => setContact(snapshot.data()));

            return () => {
                unsubscribe();
            }
        }
    }, [chat, user]);

    const setConversation = () => {
        dispatch({
            type: actionTypes.SET_ROOMDATA,
            roomData: {
                id: id,
                type: 2,
            }
        })
    };

    return (
        <div className="sidebarChat" onClick={setConversation}>
            <Avatar className="sidebarChat__avatar" src={contact.photo_url}/>
            <div className="sidebarChat__content">
                <div className="sidebarChat__topRow">
                    <div className="sidebarChat__author">
                        {contact.display_name} 
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
