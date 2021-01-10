import React, { useEffect, useState, useRef } from 'react'
import firebase from 'firebase'
import { useStateContext } from '../contexts/StateProvier';
import './Chat.css'

// Utils
import { validateMessage } from '../utils/validations';
import { db } from '../utils/firebase';
import chatbot from '../utils/axios'

// Material UI
import {Avatar, IconButton} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from "@material-ui/icons/Send";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import MicIcon from "@material-ui/icons/Mic";

function Chat() {

    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user},] = useStateContext();
    const lastMsgRef = useRef(null);
    const [{ roomData }, ] = useStateContext();
    const [chat, setChat] = useState(null);
    const [contact, setContact] = useState("");

    useEffect(() => {
        if (roomData.id) {
            const msgListener = db.collection("chats")
                .doc(roomData.id)
                .collection("messages")
                .orderBy("timestamp", "asc")
                .onSnapshot(snapshot => {
                    setMessages(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})))
                })

            return() => {
                msgListener();
            }
        }
    }, [roomData.id]);

    useEffect(() =>{
        if (roomData.id) {
            const unsubscribe = db.collection("chats").doc(roomData.id).onSnapshot(snapshot => setChat(snapshot.data()));
            return () => {
                unsubscribe();
            }
        }
    }, [roomData.id]);

    useEffect(() => {
        if (chat) {
            const contactId = (chat.members[0] === user.user_id) ? chat.members[1] : chat.members[0];
            const unsubscribe = db.collection("users").doc(contactId.trim()).onSnapshot(snapshot => setContact(snapshot.data()));
            return () => {
                unsubscribe();
            }
        }
    }, [chat, user])

    const scrollToBottom = () => {
        if (lastMsgRef.current) {
            lastMsgRef.current.scrollIntoView({
                behavior: "smooth" 
            })
        }
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();

        // Validate Textbox message
        if (validateMessage(messageInput)) {
            db.collection("chats")
            .doc(roomData.id)
            .collection("messages")
            .add({
                author_id: user.user_id, 
                author_name: user.display_name, 
                message: messageInput, 
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        // CHATBOT Response
        if (contact.user_id === "chatbot") {
            chatbot(user.user_id, messageInput, (res) => {
                db.collection("chats")
                .doc(roomData.id)
                .collection("messages")
                .add({
                    author_id: "chatbot", 
                    author_name: "ChatBot", 
                    message: res.message, 
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }

        setMessageInput("");
    };

    return (
        <div className="chat__wrapper">
            <div className="chat">
                <div className="chat__header">
                    <Avatar src={contact.photo_url}/>
                    <div className="chat__headerLeft">
                        <h3>{contact.display_name}</h3>
                        <p>
                            { messages.length === 0 ? '' : 'Last seen ' + new Date(messages[messages.length - 1]?.data.timestamp?.toDate()).toUTCString()}
                        </p>
                    </div>
                    <div className="chat__headerRight">
                        <IconButton className="chatHeader__iconBtn">
                            <SearchIcon/>
                        </IconButton>
                        <IconButton className="chatHeader__iconBtn">
                            <AttachFileIcon/>
                        </IconButton>
                        <IconButton className="chatHeader__iconBtn">
                            <MoreVertIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className="chat__body">
                    {messages.map((message) => (
                    <p  key={message.id} className={`chat__message ${message.data.author_id === user.user_id && `chat__receiver`}`}>
                        <span className={`chat__username ${message.data.author_id === user.user_id && 'hidden'}`}>
                            {message.data.author_name}
                        </span>
                        {message.data.message}
                        <span className="chat__timestamp ">
                            {message.data.timestamp && new Date(message.data.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                    ))}
                    <div ref={lastMsgRef} />
                </div>
                <div className="chat__footer">
                    <div className="chat__footerLeft">
                        <IconButton className="footer__iconBtn">
                            <SentimentVerySatisfiedIcon/>
                        </IconButton>
                    </div>
                    <form className="chat__footerForm">
                        <input 
                            value={messageInput}
                            onChange={event => setMessageInput(event.target.value)}
                            placeholder="Type your message here"
                        />
                        <div className="chat__footerFormRight">
                            <IconButton type="submit" onClick={sendMessage} className="footer__iconBtn">
                                <SendIcon/>
                            </IconButton>
                            <IconButton className="footer__iconBtn">
                                <AttachFileIcon/>
                            </IconButton>
                            <IconButton className="footer__iconBtn">
                                <MicIcon/>
                            </IconButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat
