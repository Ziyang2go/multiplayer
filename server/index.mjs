import Koa from 'koa';
import websockify from 'koa-websocket';
import route from 'koa-route';
import path from 'path';

const wsOptions = {};
const app = websockify(new Koa(), wsOptions);

function handler(websocket) {
  if (websocket.readyState === 1) {
    if (typeof message !== 'string') {
      ctx.websocket.binaryType = 'arraybuffer';
      ctx.websocket.send(message, { binary: true });
    } else {
      const msg = JSON.parse(message);
      if (msg.type === 'error') {
        clearInterval(interval);
        ctx.websocket.send(message);
        ctx.websocket.close();
      } else {
        ctx.websocket.send(message);
      }
    }
  }
}

const websockets = {
  1: {},
  2: {},
  3: {},
  4: {},
};

const roles = [
  'Zoe',
  'Warrick',
  'Zac',
  'Zed',
  'Azir',
  'Sion',
  'Lee Sin',
  'Yasuo',
];

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

app.ws.use(
  route.all('/room/:id', ctx => {
    const url = ctx.request.path;
    const id = path.basename(url);
    const { name } = ctx.request.query;

    ctx.websocket.on('message', message => {
      const event = JSON.parse(message);
      if (event.type === 'GAME_START') {
        const roleArray = shuffle(roles);
        const sockets = websockets[id];
        let index = 0;
        for (let i in sockets) {
          sockets[i].send(
            JSON.stringify({
              type: 'GAME_START',
              message: `Your role is ${roleArray[index]}`,
            })
          );
          index++;
        }
      }
    });

    ctx.websocket.on('close', () => {
      console.log('disconnected');
      clearInterval(interval);
      delete websockets[id][name];
      ctx.websocket.close();
      const sockets = websockets[id];
      const people = Object.keys(sockets).length;
      for (let i in sockets) {
        sockets[i].send(
          JSON.stringify({
            type: 'PLAYER_LEAVE',
            message: `${name} leaves the room`,
            people,
          })
        );
      }
    });

    const interval = setInterval(() => {
      try {
        if (ctx.websocket.readyState > 1) {
          ctx.websocket.terminate();
          clearInterval(interval);
          return;
        }
        ctx.websocket.ping();
      } catch (e) {
        console.log('Ping socket error, socket is closed');
        clearInterval(interval);
      }
    }, 10000);
    const sockets = websockets[id];
    const people = Object.keys(websockets[id]).length;
    let owner = people === 0;
    websockets[id][name] = ctx.websocket;
    for (let i in sockets) {
      sockets[i].send(
        JSON.stringify({
          type: 'PLAYER_JOIN',
          message: `${name} joins the room`,
          people: people + 1,
          owner: owner,
        })
      );
    }
  })
);

app.listen(4000);
