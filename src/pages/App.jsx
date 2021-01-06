import React from 'react'
import {useParams} from 'react-router-dom';
import Chat from '../components/Chat'
import SideBar from '../components/SideBar'
import './App.css'

function App() {
    const {roomId} = useParams();

    return (
        <div className="app">
            <div className="app__container">
                <SideBar/> {
                roomId && (
                    <Chat/>)
            } </div>
        </div>
    )
}

export default App
