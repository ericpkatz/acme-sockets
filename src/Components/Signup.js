import React, { useState } from 'react';
import { attemptSignup } from '../store';
import { useDispatch } from 'react-redux';

const Signup = ()=> {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const onChange = ev => {
    setCredentials({...credentials, [ ev.target.name ]: ev.target.value });
  };

  const signup = (ev)=> {
    ev.preventDefault();
    dispatch(attemptSignup(credentials));
  };
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={ signup }>
        <input
          placeholder='username'
          value = { credentials.username }
          name = 'username'
          onChange = { onChange }
          />
        <input
          placeholder='password'
          name = 'password'
          value={ credentials.password }
          onChange = { onChange }
        />
        <button>Signup</button>
      </form>
    </div>
  );
};

export default Signup;
