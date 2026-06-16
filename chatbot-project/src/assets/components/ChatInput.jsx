      import { useState,} from 'react'
      import './ChatInput.css';

     export function ChatInput({  setChatMessages }) {
        const [inputText, setInputText] = useState('');

        function saveInputText(event) {
          setInputText(event.target.value);
        }

        function getResponse(text) {
          const normalized = text.toLowerCase();
          if (normalized.includes('date')) {
            return `Today is ${new Date().toLocaleDateString()}`;
          }
          if (normalized.includes('hello') || normalized.includes('hi')) {
            return 'Hello! How can I help you?';
          }
          return 'Sorry, I do not understand. Please ask something else.';
        }

        function sendMessage() {
          if (!inputText) return;

          const userMessage = {
            message: inputText,
            sender: 'user',
            id: crypto.randomUUID()
          };

          setChatMessages((prevMessages) => [
            ...prevMessages,
            userMessage
          ]);

          setInputText('');

          const response = getResponse(inputText);
          console.log(response);

          setTimeout(() => {
            setChatMessages((prevMessages) => [
              ...prevMessages,
              {
                message: response,
                sender: 'robot',
                id: crypto.randomUUID()
              }
            ]);
          }, 250);
        }

        return (
          <div className="chat-input-container">
            <input
              placeholder="send message to chatbot" 
              size="30"
              value={inputText}
              onChange={saveInputText}
              className="chat-input"
            />
            <button 
            onClick={sendMessage}
            className="send-button"
            >send</button>
          </div>
        );
      }