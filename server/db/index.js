const conn = require('./conn');
const User = require('./User');
const Message = require('./Message');

Message.belongsTo(User, { as: 'from' });
Message.belongsTo(User, { as: 'to' });

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const [moe, lucy, larry, ethyl] = await Promise.all([
    User.create({ username: 'moe', password: '123'}),
    User.create({ username: 'lucy', password: '123' }),
    User.create({ username: 'larry', password: '123' }),
    User.create({ username: 'ethyl', password: '123' }),
  ]);

  await Promise.all([
    Message.create({ txt: 'wanna chat', fromId: moe.id, toId: lucy.id }),
    Message.create({ txt: 'hello', fromId: moe.id, toId: ethyl.id }),
  ]);
  await Message.create({ txt: 'sure moe!', fromId: lucy.id, toId: moe.id });

  return {
    users: {
      moe,
      lucy,
      larry
    }
  };
};


module.exports = {
  syncAndSeed,
  User,
};
