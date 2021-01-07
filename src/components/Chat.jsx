import React, {useEffect, useState} from 'react'
import firebase from 'firebase'
import {useParams} from 'react-router-dom';
import {db} from '../utils/firebase';
import {useStateContext} from '../contexts/StateProvier';
import MobileSideBar from './MobileSideBar';
import DashBoard from './DashBoard';
import './Chat.css'

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
    const [input, setInput] = useState("");
    const {roomId} = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user},] = useStateContext();
    const [anchorToggle, setAnchorToggle] = useState({left: false,});
  
    const toggleDrawer = (anchor, open) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setAnchorToggle({ ...anchorToggle, [anchor]: open });
    };
  
    const renderMobileNav = () => (
      <div
        onClick={toggleDrawer('left', false)}
        onKeyDown={toggleDrawer('left', false)}
      >
          <MobileSideBar/>
      </div>
    );

    useEffect(() => {
        if (roomId) {
            const nameListener = db.collection("rooms").doc(roomId).onSnapshot((snapshot) => setRoomName(snapshot.data().name));
            const msgListener = db.collection("rooms").doc(roomId).collection("messages").orderBy("timestamp", "asc").onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())));

            return() => {
                nameListener();
                msgListener();
            }

        }
    }, [roomId]);

    const sendMessage = (event) => {
        event.preventDefault();

        db.collection("rooms").doc(roomId).collection("messages").add({author_id: user.uid, author_name: user.displayName, message: input, timestamp: firebase.firestore.FieldValue.serverTimestamp()});
        setInput("");
    };

    if (!roomId) {
        return (
            <div className="chat__wrapper">
                <SwipeableDrawer
                    anchor={'left'}
                    open={anchorToggle['left']}
                    onClose={toggleDrawer('left', false)}
                    onOpen={toggleDrawer('left', true)}
                >
                    {renderMobileNav()}
                </SwipeableDrawer>
                <div className="mobileNavDiv" onClick={toggleDrawer('left', true)}>
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
                open={anchorToggle['left']}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
            >
                {renderMobileNav()}
            </SwipeableDrawer>
            <div className="chat">
                <div className="mobileNavDiv" onClick={toggleDrawer('left', true)}>
                    <IconButton>
                        <TocIcon/>
                    </IconButton>
                </div>
                <div className="chat__header">
                    <Avatar/>
                    <div className="chat__headerLeft">
                        <h3>{roomName}</h3>
                        <p>
                            { messages.length === 0 ? '' : 'Last seen ' + new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}
                        </p>
                    </div>
                    <div className="chat__headerRight">
                        <IconButton>
                            <SearchIcon/>
                        </IconButton>
                        <IconButton>
                            <AttachFileIcon/>
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className="chat__body">
                    {
                    messages.map((message) => (
                        <p key={
                                message.name
                            }
                            className={
                                `chat__message ${
                                    message.author_id === user.uid && `chat__receiver`
                                }`
                        }>
                            <span className={`chat__username ${message.author_id === user.uid && 'hidden'}`}>
                                {
                                message.author_name
                            }</span>
                            {
                            message.message
                        }
                            <span className="chat__timestamp ">
                                {
                                message.timestamp && new Date(message.timestamp?.toDate()).toUTCString()
                            } </span>
                        </p>
                    ))
                } </div>
                <div className="chat__footer">
                    <div className="chat__footerLeft">
                        <SentimentVerySatisfiedIcon/>
                    </div>
                    <form>
                        <input value={input}
                            onChange={
                                (event) => setInput(event.target.value)
                            }
                            placeholder="Type your message here"/>
                        <button type="submit"
                            onClick={sendMessage}>
                            <SendIcon/>
                        </button>
                    </form>
                    <MicIcon/>
                </div>
            </div>
        </div>
    )
}

export default Chat
