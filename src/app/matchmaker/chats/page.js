// app/matchmaker/chats/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  List,
  Avatar,
  Modal,
  Input,
  Button,
  message,
  Drawer,
  Image,
  Divider,
} from "antd";
import { CloseOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { withGuard } from "@/components/GuardRoute";
import { getMatchesForUser, sendMessage, getChatId } from "./actions";
import { useAuth } from "@/contexts/AuthContext";
import { rtdb, auth } from "../../../../firebase/config";
import { ref, onValue, off } from "firebase/database";

const MatchmakerChatsPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      if (user) {
        try {
          const fetchedMatches = await getMatchesForUser(user.uid);
          setMatches(fetchedMatches);
        } catch (error) {
          console.error("Error fetching matches:", error);
          message.error("Failed to load matches");
        }
      }
    };

    fetchMatches();
  }, [user]);

  const handleChatClick = useCallback(async (match) => {
    if (user) {
      setSelectedMatch(match);
      setChatModalVisible(true);

      const chatId = await getChatId(user.uid, match.id);
      const chatRef = ref(rtdb, `chats/${chatId}/messages`);
      
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((childSnapshot) => {
          messages.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setChatMessages(messages.sort((a, b) => a.timestamp - b.timestamp));
      });

      return () => {
        off(chatRef);
        unsubscribe();
      };
    } else {
      message.error("You must be logged in to chat");
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && selectedMatch) {
      try {
        console.log('Current user:', user.uid);
        console.log('Selected match:', selectedMatch.id);
        const chatId = await getChatId(user.uid, selectedMatch.id);
        console.log('Chat ID:', chatId);
        
        await sendMessage(chatId, user.uid, newMessage.trim());
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        message.error("Failed to send message: " + error.message);
      }
    } else {
      console.log('Send message conditions not met:', { 
        newMessage: !!newMessage.trim(), 
        user: !!user, 
        selectedMatch: !!selectedMatch 
      });
    }
  };

  const handleViewProfile = () => {
    setProfileDrawerVisible(true);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Matches</h1>
        <List
          itemLayout="horizontal"
          dataSource={matches}
          renderItem={(match) => (
            <List.Item
              onClick={() => handleChatClick(match)}
              className="cursor-pointer hover:bg-gray-800 rounded-lg p-2"
            >
              <List.Item.Meta
                avatar={<Avatar src={match.avatar} size={48} />}
                title={<span className="text-lg">{match.name}</span>}
                description={
                  <div>
                    <p className="text-sm text-gray-400">{match.lastMessage}</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={
          <div className="flex flex-col">
            <span className="mb-2">
              {selectedMatch ? selectedMatch.name : "Chat"}
            </span>
            <div className="flex">
              <Button
                className="mr-2"
                icon={<UserOutlined />}
                onClick={handleViewProfile}
              >
                View Profile
              </Button>
              <Button icon={<CloseOutlined />} onClick={() => setChatModalVisible(false)}>
                Close Chat
              </Button>
            </div>
            <Divider />
          </div>
        }
        open={chatModalVisible}
        onCancel={() => setChatModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="h-96 overflow-y-auto mb-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${
                msg.senderId === user?.uid ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.senderId === user?.uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={handleSendMessage}
            placeholder="Type a message..."
            className="flex-grow mr-2"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          >
            Send
          </Button>
        </div>
      </Modal>

      <Drawer
        title="Profile"
        placement="right"
        onClose={() => setProfileDrawerVisible(false)}
        open={profileDrawerVisible}
        width={640}
      >
        {selectedMatch && (
          <div>
            <Avatar src={selectedMatch.avatar} size={128} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">{selectedMatch.name}</h2>
            {/* Add more profile details here */}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default withGuard(MatchmakerChatsPage, {
  requireAuth: true,
  requiredMode: "user",
});