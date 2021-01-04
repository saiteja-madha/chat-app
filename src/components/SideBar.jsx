import React from "react";
import "./Sidebar.css";

// Material UI
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";

function SideBar() {
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
        <div className="siebar__search">
            <div className="sidebar__searchcontainer">
                <SearchIcon />
                <input placeholder="Find or start a conversation" type="text" />
            </div>
        </div>

        <div className="sidebar__chhatsGroups">
        </div>
    </div>
    )
}

export default SideBar
