import { useEffect, useState } from "react";
import { Conversation } from "../types/conversation";
import Messages from "../components/Messages";

function UserDetails({ selectedUser }) {
  const [userConversations, setUserConversations] = useState<Conversation[]>();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();

  useEffect(() => {
    setUserConversations([]);
  }, [selectedUser]);

  const conversationsByUser = async () => {
    const response = await fetch(
      `http://localhost:3005/conversations/${selectedUser.id}`
    );
    const userContent = await response.json();
    setUserConversations(userContent);
    console.log("user conv:", userContent);
  };

  return (
    <div>
      User Selected:{selectedUser.id}
      <button onClick={conversationsByUser}>get all conversations</button>
      {userConversations &&
        userConversations.map((conversation) => (
          <div style={{ border: "solid 2px black" }} key={conversation.id}>
            {selectedUser.id !== conversation.recipientId ? (
              <button onClick={() => setSelectedConversation(conversation)}>
                {conversation.recipientNickname}
              </button>
            ) : (
              <button onClick={() => setSelectedConversation(conversation)}>
                {conversation.senderNickname}
              </button>
            )}
          </div>
        ))}
      {selectedConversation && (
        <Messages
          conversation={selectedConversation}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
}

export default UserDetails;
