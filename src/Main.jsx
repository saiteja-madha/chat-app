import App from './pages/App'
import Login from './pages/Login'
import {useStateContext} from './contexts/StateProvier';
import './Main.css';

function Main() {
  const [{user},] = useStateContext();

    return (
        <div> {
          user ? <App/> : <Login/>
        } </div>
    );
}

export default Main;
