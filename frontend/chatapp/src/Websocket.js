class WebsocketService{

        static instance = null;
        callbacks =  {};
        static getInstance(){
            if (!WebsocketService.instance){
                WebsocketService.instance = new WebsocketService() ;
            }
            return WebsocketService.instance;
        }
        constructor(){
            this.socketRef = null ;
            
        }

        connect(){
            const path = 'ws://127.0.0.1:8000/ws/chat/test/';
            this.socketRef = new WebSocket(path); 
            this.socketRef.onopen = () =>{
                console.log("Websocket Open");
            }
            this.socketNewMessage(JSON.stringify({
                command : 'fetch_messages'
            })); 
            this.socketRef.onmessage = e => {
               this.socketNewMessage(e.data)
            }

            this.socketRef.onerror = e => {
                console.log(e.message)
            }

            this.socketRef.onclose = () =>{
                console.log("Websocket Closed..")
                this.connect();
            }
        }
        
        
        socketNewMessage(data){
            const ParsedData = JSON.parse(data);
            const command = ParsedData.command
            if (Object.keys(this.callbacks).length === 0){
                return ;
            }
            if (command === 'messages'){
                this.callbacks[command](ParsedData.messages) 
            }
            if (command === 'new_message'){
                this.callbacks[command](ParsedData.message)
            }
        }

        fetchMessages(username){
            this.sendMessage({ command :'fetch_messages', username  : username})
        }

        newChatMessage(message){
            this.sendMessage({ command :'new_message',from : message.from, message : message.content})
        }

        addCallbacks(messagesCallback, newMessageCallback){
            this.callbacks['messages'] = messagesCallback;
            this.callbacks['new_message'] = newMessageCallback;
        }

        sendMessage(data){
            try {
                this.socketRef.send(JSON.stringify({...data}))
            } catch (error) {
                console.log(error.message)
            }
        }

        ws_state() {
            return this.socketRef.readyState;
          }
}

const WebSocketInstance = WebsocketService.getInstance();
export default WebSocketInstance;