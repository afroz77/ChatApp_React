import React from 'react';
import Sidepanel from './sidepanel/sidepanel';
import WebSocketInstance from '../Websocket';
import Button from '@material-ui/core/Button';
 
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

    messageChangeHandler = e =>{
        e.preventDefault();
        this.setState({
            message : e.target.value     
        });
    }

    sendMessageHandler = e =>{
        e.preventDefault();
        const messageObject = {
            from : 'admin',
            content : this.state.message
        }
        if (this.state.message !== ""){
            WebSocketInstance.newChatMessage(messageObject)
            this.setState({
                message : ""
            });
        }
    }

    renderMessages = (messages) =>{
        const currentUser = 'admin';
        console.log(messages)
        return messages.map(message =>(
            <li
                key = {message.id}
                className = {message.auther === currentUser ? 'sent' : 'replies'}>
                <p>
                    { message.content }
                </p>
                <br />
                <small>
                    {message.timestamp} 
                </small>
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
                <p>USERNAME</p>
            </div>
            <div className="messages">
                <ul id='chat-log'>
                    {
                        messages && this.renderMessages(messages)
                    }
                </ul>
            </div>
           
            <div className="message-input">
                <input 
                    onChange = {this.messageChangeHandler}
                    value = {this.state.message}
                    id="chat-message-input" 
                    type="text" 
                    size="100"/><span>
                    {/* <input id="chat-message-submit" type="button" value="Send"/> */}
                    <Button variant="contained" onClick = {this.sendMessageHandler} color="primary">Send
                    </Button></span>
               
                
            </div>
            
        </div>
    </div>
        )
    }
}

export default Chat; 