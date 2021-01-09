import React from 'react'
import Chat from '../components/Chat'
import DashBoard from '../components/DashBoard'
import MobileNav from '../components/MobileNav'
import Room from '../components/Room'
import SideBar from '../components/SideBar'
import { useStateContext } from '../contexts/StateProvier'
import './App.css'

function App() {
    const [{roomData}, ] = useStateContext();

    return (
        <div className="app">
            <div className="app__container">
                <SideBar/>
                <MobileNav/>
                { roomData === null ? (<DashBoard/>) : 
                    roomData?.type === 1 ? 
                    <Room/> : 
                    <Chat/>
                }
            </div>
        </div>
    )
}

export default App