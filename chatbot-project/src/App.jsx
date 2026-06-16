import { useState,} from 'react'
import { ChatInput } from './assets/components/ChatInput'
import ChatMessagesList from './assets/components/ChatMessages'
import './App.css'   

function App() {
        const [chatMessages, setChatMessages] = useState([{ 
          message: 'hello chatbot',
          sender: 'user',
          id: 'id1'
        },
        {
          message: 'Hello! how can i help you',
          sender: 'robot',
          id: 'id2'
        },
        {
          message: 'can you get me today\'s date',
          sender: 'user',
          id: 'id3'
        },
        {
          message: 'Today is on 9th june',
          sender: 'robot',
          id: 'id4'
        }]);

        return (
        <div className="app-container">

               <ChatMessagesList
                chatMessages={chatMessages}
                />
                <ChatInput 
                chatMessages={chatMessages}
                 setChatMessages=
                 {setChatMessages} 
                 />
            </div>
        );
      }


export default App
