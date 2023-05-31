import axios from 'axios';

const messages = (state = [], action)=> {
  if(action.type === 'SET_MESSAGES'){
    return action.messages;
  }
  if(action.type === 'CREATE_MESSAGE'){
    return [...state, action.message];
  }
  return state;
};



export const fetchMessages = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    const response = await axios.get('/api/messages', {
      headers: {
        authorization: token
      }
    });
    dispatch({ type: 'SET_MESSAGES', messages: response.data });
  };
};

export const createMessage = (message)=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    const response = await axios.post('/api/messages', message, {
      headers: {
        authorization: token
      }
    });
    dispatch({ type: 'CREATE_MESSAGE', message: response.data });
  };
};



export default messages;
