import React from 'react'
import Chat from '../components/Chat'
import SideBar from '../components/SideBar'
import './App.css'

function App() {
    return (
        <div className="app">
            <div className="app__container">
                <SideBar/>
                <Chat/>
            </div>
        </div>
    )
}

export default App
