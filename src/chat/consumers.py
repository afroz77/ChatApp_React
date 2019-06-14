# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from django.contrib.auth import get_user_model

from .models import Message


User = get_user_model()

class ChatConsumer(WebsocketConsumer):

    # Fetching Last 30 Messages From The Database By Calling Method
    def fetch_messages(self, data):
        messages = Message.last_10_message()     # Get Last 30 Messages In A messages Var
        content = {
            'command' : 'messages',
            'messages' : self.messsages_to_json(messages)  
        }
        self.send_message(content)
        
 
    def messsages_to_json(self, messages):
        result = []
        for message in messages:                    # Loop Through All Messages
            result.append(self.message_to_json(message))  # Pass Single message Object To Method And Append To List
        return result                                       # Finally Return The List 

    def message_to_json(self, message):         
        return {
            'id' : message.id,
            'auther': message.auther.username,
            'content'  : message.content,
            'timestamp' : str(message.timestamp)
        }


    def new_message(self, data):
        auther = data['from']
        auther_user = User.objects.filter(username=auther)[0]
        message = Message.objects.create(
            auther = auther_user, 
            content = data['message'])
        
        content = {
            'command' : 'new_message',
            'message' : self.message_to_json(message)
        }
        return self.send_chat_message(content)

    commands = {
            'fetch_messages' : fetch_messages,
            'new_message' : new_message
        }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
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

    def send_message(self, message):
        self.send(text_data=json.dumps(message))
     
    
    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))