import React, {useState} from "react";
import SidebarChat from './SidebarChat'
import "./Sidebar.css";

// Material UI
import {Avatar, IconButton} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";

function SideBar() {
    const [input, setInput] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        // TODO: Search Logic

        setInput("");
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon className="sidebar__iconBtn"/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon className="sidebar__iconBtn"/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon className="sidebar__iconBtn"/>
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <form onSubmit={handleSubmit}
                    className="sidebar__searchcontainer">
                    <SearchIcon/>
                    <input value={input}
                        onChange={
                            (e) => setInput(e.target.value)
                        }
                        formAction="submit"
                        placeholder="Find or create a chat-room"
                        type="text"/>
                </form>
            </div>
            <div className="sidebar__chatGroups">
                <SidebarChat/>
            </div>
        </div>
    )
}

export default SideBar
