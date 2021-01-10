import React from 'react'
import { useStateContext } from '../contexts/StateProvier'
import './DashBoard.css'

function DashBoard() {
    const [{user}, ] = useStateContext();
    return (
        <div className="dashboard">
            <img src="https://i.imgur.com/uUqkiYo.png" alt="dahsboard"/>
            <span>Hello {user?.display_name}</span>
            <span>Click on a chat-room</span>
            <span>Start a new conversation</span>
        </div>
    )
}

export default DashBoard
