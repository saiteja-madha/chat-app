import React from 'react'
import './SidebarChat.css'

// Material UI
import {Avatar} from '@material-ui/core'

function SidebarChat() {
    return (
        <div className="sidebarChat">
            <Avatar className="sidebarChat__avatar"/>
            <div className="sidebarChat__content">
                <div className="sidebarChat__topRow">
                    <div className="sidebarChat__author">
                        Martian
                    </div>
                    <div className="sidebarChat__lastSeen">
                        12:29AM
                    </div>
                </div>
                <div className="sidebarChat__chat">
                    Good Morning!
                </div>
            </div>
        </div>
    )
}

export default SidebarChat
