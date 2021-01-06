import App from './pages/App'
import Login from './pages/Login'
import {Redirect, Switch, BrowserRouter as Router, Route} from "react-router-dom";
import './Main.css';

function Main() {
    const user = "null";
    return (
        <div>
            <Router> {
                ! user ? (
                    <Redirect to='/login'/>
                ) : (
                    <Redirect to='/app'/>
                )
            }
                <Switch>
                    <Route exact path='/app'
                        component={App}/>
                    <Route path='/login'
                        component={Login}/>
                </Switch>
            </Router>
        </div>
    );
}

export default Main;
