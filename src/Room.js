import React, { Component } from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: 0,
      messages: [],
      name: null,
      owner: null,
    };
  }

  getUsername() {
    let username = prompt('Please choose a user name');
    if (!username) {
      username = this.getUsername(username);
    }
    return username;
  }

  componentDidMount() {
    const self = this;
    let playername = this.getUsername();
    const ws = new WebSocket(`ws://localhost:4000/room/1?name=${playername}`);
    ws.onmessage = message => {
      const msg = JSON.parse(message.data);
      const eventType = msg.type;
      if (eventType === 'PLAYER_JOIN' || eventType === 'PLAYER_LEAVE') {
        const message = msg.message;
        const people = msg.people;
        const owner = msg.owner;
        let { messages } = this.state;
        messages.push(message);
        this.setState({ messages, owner, people });
      } else if (eventType === 'GAME_START') {
        const message = msg.message;
        const el = document.createElement('li');
        el.innerHTML = message;
        self.refs['role'].appendChild(el);
      }
    };
    this.setState({ ws });
  }

  componentWillUnmount() {
    const { ws } = this.state;
    ws.close();
  }

  startGame() {
    const { ws } = this.state;
    ws.send(JSON.stringify({ type: 'GAME_START' }));
  }

  renderMessages() {
    const { messages } = this.state;
    return messages.map(msg => <li>{msg}</li>);
  }

  render() {
    const { people } = this.state;
    return (
      <div>
        <div style={{ float: 'right', marginRight: 10 }}>
          {' '}
          People: {people}{' '}
        </div>
        <div ref="messages">
          <h4>Message</h4>
          {this.renderMessages()}
        </div>
        <button className="button" onClick={this.startGame.bind(this)}>
          {' '}
          Start Game{' '}
        </button>
        <div ref="role" />
      </div>
    );
  }
}
