import React, {useState} from 'react'
import './Chat.css'

// Material UI
import {Avatar, IconButton} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from "@material-ui/icons/Send";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import MicIcon from "@material-ui/icons/Mic";

function Chat() {
    const [input, setInput] = useState("")

    const SendMessage = (event) => {
        event.preventDefault();

        // TODO: Save to DB

        setInput("");
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar/>
                <div className="chat__headerLeft">
                    <h3>Martian</h3>
                    <p>Last Seen...</p>
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
                <div className={
                    `chat__message ${
                        true && 'chat__receiver'
                    }`
                }>
                    Hey Guys
                    <span className="chat__timestamp">12:47 AM</span>
                </div>
            </div>
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
                    <IconButton onClick={SendMessage}
                        type="submit">
                        <SendIcon/>
                    </IconButton>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat
