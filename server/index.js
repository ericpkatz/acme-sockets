const app = require('./app');
const { syncAndSeed, User } = require('./db');
const ws = require('ws');
const socketMap = require('./socketMap');

const init = async()=> {
  try {
    if(process.env.SYNC !== 'NO'){
      await syncAndSeed();
    }
    const port = process.env.PORT || 3000;
    const server = app.listen(port, ()=> console.log(`listening on port ${port}`));

    const socketServer = new ws.WebSocketServer({ server });
    socketServer.on('connection', (socket)=> {
      socket.on('close', ()=> {
        const userId = socket.userId;
        delete socketMap[userId];
        Object.values(socketMap).forEach(value => {
          value.socket.send(JSON.stringify({ type: 'LOGOUT', user: { id: userId }}));
        });
      });
      socket.on('message', async(data) => {
        const message = JSON.parse(data);
        if(message.token){
          const user = await User.findByToken(message.token);
          socketMap[user.id] = { socket, user};
          socket.userId = user.id;

          Object.values(socketMap).forEach( value => {
            if(value.user.id !== user.id){
              value.socket.send(JSON.stringify({ type: 'LOGIN', user }));
            }
          });
        }
      });
    });
  }
  catch(ex){
    console.log(ex);
  }
};

init();
