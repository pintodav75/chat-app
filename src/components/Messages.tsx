import { useEffect, useState } from "react";
import { Message } from "../types/message";

function Messages({ conversation, selectedUser }) {
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  function DisplayMessage() {
    return (
      <div>
        {currentMessages.map((message) => {
          if (
            (message.authorId === 1 &&
              conversation.senderId === selectedUser.id) ||
            (message.authorId === 2 &&
              !(conversation.recipientId !== selectedUser.id))
          ) {
            return (
              <>
                <div style={{ backgroundColor: "blue" }} key={message.id}>
                  {message.body}
                  <button onClick={() => deleteMessage(message.id)}>X</button>
                </div>
              </>
            );
          }
          return <div key={message.id}>{message.body}</div>;
        })}
      </div>
    );
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:3005/messages/${conversation.id}`
      );
      const messagesContent = await response.json();
      setCurrentMessages(messagesContent);
    }
    fetchData();
  }, [conversation.id, setCurrentMessages]);

  useEffect(() => {
    console.log("messages tab:", currentMessages);
  }, [currentMessages]);

  const deleteMessage = async (messageId: number) => {
    console.log("message Id to delete", messageId);
    const settings = {
      method: "DELETE",
      Headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `http://localhost:3005/message/${messageId}`,
        settings
      );
      console.log("response:", response);
    } catch (error) {
      console.log({ error });
    }
  };

  const postMessage = async () => {
    let messageCreatorID: number = 2;
    if (selectedUser.id === conversation.senderId) messageCreatorID = 1;

    const settings = {
      method: "POST",
      body: JSON.stringify({
        conversationId: conversation.id,
        authorId: messageCreatorID,
        timestamp: Date.now(),
        body: newMessage,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `http://localhost:3005/messages/${conversation.id}`,
        settings
      );
      const createdMessage = await response.json();

      setCurrentMessages([...currentMessages, createdMessage]);
      setNewMessage("");
    } catch (error) {
      console.log({ error });
    }
  };
  const handleChange = (event: any) => {
    setNewMessage(event.target.value);
  };

  return (
    <div>
      <DisplayMessage />
      <input
        type="text"
        id="newMessage"
        name="newMessage"
        onChange={handleChange}
        value={newMessage}
      />
      <button onClick={postMessage}>New message</button>
    </div>
  );
}

export default Messages;
