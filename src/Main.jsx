import App from './pages/App'
import Login from './pages/Login'
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import './Main.css';
import {useStateContext} from './contexts/StateProvier';

function Main() {
    const [
        {
            user
        },
    ] = useStateContext();

    return (
        <div> {
            !user ? <Login/>: (
                <Router>
                    <Switch>
                        <Route exact path='/'>
                            <App/>
                        </Route>
                        <Route exact path='/login'>
                            <Login/>
                        </Route>
                        <Route exact path='/rooms/:roomId'>
                            <App/>
                        </Route>
                    </Switch>
                </Router>
            )
        } </div>
    );
}

export default Main;
