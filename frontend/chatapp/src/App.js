import React from 'react';
import './App.css';
import Chat from './containers/Chat'
import WebSocketInstance from './Websocket';
class App extends React.Component {
  
  componentDidMount(){
    WebSocketInstance.connect()
  }
  render(){
  return (
    <div >
      <Chat />
    </div>    
  );
}
}

export default App;
