import React from 'react';
import Sidepanel from './sidepanel/sidepanel'
import WebSocketInstance from '../Websocket'
 
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.waitForSocketConnection(() =>{
            WebSocketInstance.addCallbacks(
                this.setMessages.bind(this),
                this.addMessage.bind(this)
            )
            WebSocketInstance.fetchMessages(this.props.currentUser)
            WebSocketInstance.connect();
        });
    }

    waitForSocketConnection(callback){
        const component = this;
        setTimeout( function() {
            if(WebSocketInstance.ws_state() === 1){
                console.log("Connection Is Secured.");              
                callback()
                return
            }
            else{
                console.log('Waiting For Connection..')
                component.waitForSocketConnection(callback);
            }
        }, 300); 
    }

    addMessage(message){
        this.setState({
            messages : [...this.state.messages, message]
        })
    }
    setMessages(messages){
        this.setState({
            messages : messages.reverse()
        });
    }

    renderMessages = (messages) =>{
        const currentUser = 'admin1';
        console.log(messages)
        return messages.map(message =>(
            <li
                key = {message.id}
                className = {message.auther === currentUser ? 'sent' : 'replies'}>
                <p>
                    { message.content }
                </p>
            </li>
        ));
    }

    render(){
        const messages = this.state.messages;
    return(
    <div id="frame">
    <Sidepanel  />
        <div className="content">
            <div className="contact-profile">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                <p></p>
                <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                </div>
            </div>
            <div className="messages">
                <ul id='chat-log'>
                    {
                        messages && this.renderMessages(messages)
                    }
                </ul>
            </div>
            <div className="message-input">
                <div className="wrap">
                    <input id="chat-message-input" type="text" size="100"/><br/>
                    <input id="chat-message-submit" type="button" value="Send"/>
                </div>
            </div>
        </div>
    </div>
        )
    }
}

export default Chat; 