import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Signup from './Components/Signup';
import User from './Components/User';
import Error from './Components/Error';
import Cookies from 'js-cookie';
import Prof from './Components/Prof';

function App() {
  const Auth = Cookies.get("auth");
  const ProfAuth = Cookies.get("profauth");

  return (
    <div>
      <Routes>
        {!Auth &&
          (<>
            <Route exact path='/' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
          </>)}
        {Auth && <Route path="/user" element={<User />} />}
        {ProfAuth && <Route path="/prof" element={<Prof />} />}
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
