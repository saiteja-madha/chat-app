import React, { useState } from 'react'
import MobileSideBar from './MobileSideBar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import TocIcon from '@material-ui/icons/Toc';
import {IconButton} from "@material-ui/core";
import './MobileNav.css'

function MobileNav() {
    const [leftAnchor, setLeftAnchor] = useState(false);
    
    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setLeftAnchor(open);
      };

    const renderMobileNav = () => (
        <div
          onKeyDown={toggleDrawer(false)}
        >
            <MobileSideBar/>
        </div>
      );
      
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default MobileNav
