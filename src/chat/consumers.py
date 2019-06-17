# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from django.contrib.auth import get_user_model
from .models import Message
User = get_user_model()

class ChatConsumer(WebsocketConsumer):

    # Fetching Last 10 Messages From The Database By Calling Method
    def fetch_messages(self, data):
        # Callling last_10_message() method To Get Messages As One Object
        messages = Message.last_10_message()     # Get Last 30 Messages In A messages Var
        # Format The Message In JSON Format
        content = {
            'command' : 'messages',         
            'messages' : self.messsages_to_json(messages)  
        }
        self.send_message(content) # Call Send Message Function To Send The Message To The Browser
    
    """
        Send Message Function Take The Parameter As Messages Object And Send It To Browser
    """
    def send_message(self, message):
        self.send(text_data=json.dumps(message))
 
    """
        This Method Convert All MEssages In The JSon Format And Store In List And Return The List
    """
    def messsages_to_json(self, messages):
        # Declare The Empty List
        result = []                 
        # Loop Through All Messages
        for message in messages:                    
            result.append(self.message_to_json(message))  # Pass Single message Object To Method And Append To List
        return result                                       # Finally Return The List 
    """
    This Method Return The Single Message To Json Format Calling By Above Method
    Assign The Message Id, AutheName, content And timestamp
    """
    def message_to_json(self, message):         
        return {                
            'id' : message.id,                      # Assign Message Id
            'auther': message.auther.username,      # Assign Auther Name
            'content'  : message.content,           # Assign content
            'timestamp' : str(message.timestamp)    # Assign Timestamp
        }
    """
    This Methos Takes The New Message And Store In The Database And
         
    Return The Formatted Mesasge Back To The Browser By Calling send_chat_message Followed By Parameter
    content 
   
    """
    def new_message(self, data):
        auther = data['from']   # Name Of The Sender
        auther_user = User.objects.filter(username=auther)[0] # Get The Sender Data By Username
        message = Message.objects.create(      # Create New Message
            auther = auther_user,              # Assign Sender As Auther
            content = data['message'])         # Assign Content
        content = {                            # Assign Command As New_message
            'command' : 'new_message',                          
            'message' : self.message_to_json(message) # Format The Message In Json By Calling The Above Method
        }
        # Return The Formatted Message To Browser
        return self.send_chat_message(content)   

    """
    Assign Command By Function Names To Call

    Assign fetch_messages It Return The All Fetched Messages From The Database
    Assign new_message It Store The New Message To Database And Send The New Message To The Browser

    """
    
    commands = {
            'fetch_messages' : fetch_messages,  # Assign Fetch_messages with function name fetch_messages See Line 12 
            'new_message' : new_message         # Assign new_messages with function name new_messages See Line 57
        }
    """
        This Methos Connect With The Room By Getting Room Name And Room Group Name
    """
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name'] # Get Room Name From Url
        self.room_group_name = 'chat_%s' % self.room_name   # Get Room Group Name By Appending Room Name

        # Joining The Room By Calling Django Channel Method group_add Syanchronously
        async_to_sync(self.channel_layer.group_add)( 
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leaving The Room By Calling Django Channel Method group_discard Method
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    # Send Message To The Room

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

   
     
    
    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))