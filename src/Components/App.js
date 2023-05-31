import React, { useEffect, useRef } from 'react';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Conversations from './Conversations';
import { useSelector, useDispatch } from 'react-redux';
import { createMessage, fetchMessages, loginWithToken, fetchOnlineUsers } from '../store';
import { Link, Routes, Route } from 'react-router-dom';



const App = ()=> {
  const { auth, onlineUsers, messages } = useSelector(state => state);
  const prevAuth = useRef(auth);
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(loginWithToken());
  }, []);

  useEffect(()=> {
    if(!prevAuth.current.id && auth.id){
      //check messages
      dispatch(fetchMessages());
      console.log('you just logged in.');
      window.socket = new WebSocket(window.location.origin.replace('http', 'ws'));
      window.socket.addEventListener('open', ()=> {
        window.socket.send(JSON.stringify({ token: window.localStorage.getItem('token')}));
      });
      window.socket.addEventListener('message', (ev)=> {
        const message = JSON.parse(ev.data);
        if(message.type){
          dispatch(message);
        }
      });
      dispatch(fetchOnlineUsers());
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
        auth.id ? <Home /> : (<div><Login /><Signup /></div>)
      }
      {
        !!auth.id && (
          <div>
            <h1>OnlineUsers ({ onlineUsers.length })</h1>
            <ul>
              {
                onlineUsers.map( user => {
                  return (
                    <li key={ user.id }>
                      { user.username }
                      <button
                        onClick={
                          ()=> {
                            dispatch(createMessage({ toId: user.id, txt: 'lets chat'}))
                          }
                        }
                        disabled={ messages.find(message => message.fromId === user.id || message.toId === user.id )}>Start Conversation</button>
                    </li>
                  );
                })
              }
            </ul>
            <Conversations />
          </div>
        )
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
