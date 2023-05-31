import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createMessage } from '../store';

const Conversations = ()=> {
  const { messages, auth, onlineUsers } = useSelector(state => state);
  const dispatch = useDispatch();

  const conversationMap = messages.reduce((acc, message)=> {
    const withUser = message.fromId === auth.id ? message.to : message.from;
    const online = onlineUsers.find(user => user.id === withUser.id);
    acc[withUser.id] = acc[withUser.id] || { messages: [], withUser, online };
    acc[withUser.id].messages.push({...message, mine: auth.id === message.fromId });
    return acc;
  }, {});
  const conversations = Object.values(conversationMap);


  return (
    <div id='conversations'>
      {
        conversations.map( (conversation, idx) => {
          return (
            <div key={ idx } className={ conversation.online ? 'online': ''}>
              <h3>{ conversation.withUser.username }</h3>
              <ul>
                {
                  conversation.messages.map( message => {
                    return (
                      <li key={ message.id } className={ !message.mine ? 'yours': ''}>
                        { message.txt }
                        { ' ' } 
                        from { message.mine ? 'you' : conversation.withUser.username }
                      </li>
                    );
                  })
                }
              </ul>
              <form onSubmit={
                (ev)=> {
                  ev.preventDefault();
                  const txt = ev.target.querySelector('input').value;
                  dispatch(createMessage({ txt, toId: conversation.withUser.id }));
                  ev.target.querySelector('input').value = '';
                }
              }>
                <input placeholder={`send message to ${conversation.withUser.username }`}/>
              </form>
            </div>
          );
        })
      }
    </div>
  );
};

export default Conversations;
