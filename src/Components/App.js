import React, { useEffect, useRef } from 'react';
import Home from './Home';
import Login from './Login';
import { useSelector, useDispatch } from 'react-redux';
import { loginWithToken } from '../store';
import { Link, Routes, Route } from 'react-router-dom';


const App = ()=> {
  const { auth } = useSelector(state => state);
  const prevAuth = useRef(auth);
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(loginWithToken());
  }, []);

  useEffect(()=> {
    if(!prevAuth.current.id && auth.id){
      console.log('you just logged in.');
      window.socket = new WebSocket(window.location.origin.replace('http', 'ws'));
      window.socket.addEventListener('open', ()=> {
        window.socket.send(JSON.stringify({ token: window.localStorage.getItem('token')}));
      });
      window.socket.addEventListener('message', (ev)=> {
        const message = JSON.parse(ev.data);
        console.log(message);
      });
    }
    if(prevAuth.current.id && !auth.id){
      window.socket.close();
    }
  }, [auth]);

  useEffect(()=> {
    prevAuth.current = auth;
  });

  return (
    <div>
      <h1>FS App Template</h1>
      {
        auth.id ? <Home /> : <Login />
      }
      {
        !!auth.id  && (
          <div>
            <nav>
              <Link to='/'>Home</Link>
            </nav>
          </div>
        )
      }
    </div>
  );
};

export default App;
