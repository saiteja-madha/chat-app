import React, { useEffect, useState, useRef } from 'react'
import firebase from 'firebase'
import { useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/StateProvier';
import MobileSideBar from './MobileSideBar';
import DashBoard from './DashBoard';
import './Chat.css'

// Utils
import { validateMessage } from '../utils/validations';
import { db } from '../utils/firebase';

// Material UI
import {Avatar, IconButton} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from "@material-ui/icons/Send";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import MicIcon from "@material-ui/icons/Mic";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import TocIcon from '@material-ui/icons/Toc';

function Chat() {

    const [messageInput, setMessageInput] = useState("");
    const {roomId} = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user},] = useStateContext();
    const [leftAnchor, setLeftAnchor] = useState(false);
    const lastMsgRef = useRef(null);
  
    const toggleDrawer = (open) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setLeftAnchor(open);
    };
  
    const renderMobileNav = () => (
      <div
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
          <MobileSideBar/>
      </div>
    );

    useEffect(() => {
        if (roomId) {
            const nameListener = db.collection("rooms")
                .doc(roomId)
                .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

            const msgListener = db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .orderBy("timestamp", "asc")
                .onSnapshot(snapshot => {
                    setMessages(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})))
                })

            return() => {
                nameListener();
                msgListener();
            }
        }
    }, [roomId]);

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

        if (validateMessage(messageInput)) {
            db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
                author_id: user.user_id, 
                author_name: user.display_name, 
                message: messageInput, 
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        setMessageInput("");
    };

    if (!roomId) {
        return (
            <div className="chat__wrapper">
                <SwipeableDrawer
                    anchor={'left'}
                    open={leftAnchor}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    {renderMobileNav()}
                </SwipeableDrawer>
                <div className="mobileNavDiv" onClick={toggleDrawer(true)}>
                    <IconButton>
                        <TocIcon/>
                    </IconButton>
                </div>
                <DashBoard/>
            </div>
        )
    }

    return (
        <div className="chat__wrapper">
            <SwipeableDrawer
                anchor={'left'}
                open={leftAnchor}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                {renderMobileNav()}
            </SwipeableDrawer>
            <div className="chat">
                <div className="mobileNavDiv" onClick={toggleDrawer(true)}>
                    <IconButton>
                        <TocIcon/>
                    </IconButton>
                </div>
                <div className="chat__header">
                    <Avatar/>
                    <div className="chat__headerLeft">
                        <h3>{roomName}</h3>
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
