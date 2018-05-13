import React, { Component } from 'react';

export default class Home extends Component {
  enterRoom(e) {
    const id = e.target.id;
    this.props.history.push(`/room/${id}`);
  }

  render() {
    return (
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <button
          id="1"
          onClick={e => this.enterRoom(e)}
          className="button"
          style={{ margin: 20 }}
        >
          ROOM1
        </button>
        <button
          id="2"
          onClick={e => this.enterRoom(e)}
          className="button"
          style={{ margin: 20 }}
        >
          ROOM2
        </button>
        <button
          id="3"
          onClick={e => this.enterRoom(e)}
          className="button"
          style={{ margin: 20 }}
        >
          ROOM3
        </button>
        <button
          id="4"
          onClick={e => this.enterRoom(e)}
          className="button"
          style={{ margin: 20 }}
        >
          ROOM4
        </button>
      </div>
    );
  }
}
