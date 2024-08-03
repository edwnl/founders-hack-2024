// app/matchmaker/chats/OrganizerDashboard.js
"use client";

import { useState, useEffect } from "react";
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

const MatchmakerChatsPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);

  useEffect(() => {
    // Fetch matches data (using dummy data for now)
    const dummyMatches = [
      {
        id: "1",
        name: "Alice Johnson",
        avatar: "https://picsum.photos/id/1027/200",
        lastMessage: "Hey, how's it going?",
        timestamp: "2024-08-03T10:30:00Z",
        bio: "Adventure seeker and coffee enthusiast. Always planning my next trip!",
        age: 28,
        location: "New York, NY",
        prompts: [
          {
            question: "My ideal first date",
            answer: "A cozy cafe and a walk in Central Park",
          },
          {
            question: "Two truths and a lie",
            answer:
              "I've climbed Kilimanjaro, I can speak 3 languages, I've never had a brain freeze",
          },
          {
            question: "My go-to karaoke song",
            answer: "Don't Stop Believin' by Journey",
          },
        ],
        pictures: [
          "https://picsum.photos/id/1027/400",
          "https://picsum.photos/id/1028/400",
          "https://picsum.photos/id/1029/400",
          "https://picsum.photos/id/1030/400",
        ],
      },
      {
        id: "2",
        name: "Bob Smith",
        avatar: "https://picsum.photos/id/1025/200",
        lastMessage: "Are you excited for the event?",
        timestamp: "2024-08-03T09:45:00Z",
        bio: "Tech geek by day, amateur chef by night. Ask me about my latest coding project or recipe!",
        age: 32,
        location: "San Francisco, CA",
        prompts: [
          {
            question: "My hidden talent",
            answer: "I can solve a Rubik's cube in under 2 minutes",
          },
          {
            question: "My favorite travel story",
            answer:
              "Getting lost in Tokyo and stumbling upon the best ramen of my life",
          },
          {
            question: "What I'm looking for",
            answer: "Someone to explore new restaurants and tech meetups with",
          },
        ],
        pictures: [
          "https://picsum.photos/id/1025/400",
          "https://picsum.photos/id/1031/400",
          "https://picsum.photos/id/1032/400",
          "https://picsum.photos/id/1033/400",
        ],
      },
      {
        id: "3",
        name: "Carol Davis",
        avatar: "https://picsum.photos/id/1062/200",
        lastMessage: "I love that band too!",
        timestamp: "2024-08-02T18:20:00Z",
        bio: "Music teacher with a passion for indie rock. Always on the hunt for new vinyl records.",
        age: 26,
        location: "Austin, TX",
        prompts: [
          {
            question: "My ultimate concert lineup",
            answer: "The Strokes, Tame Impala, and Arctic Monkeys",
          },
          {
            question: "A cause I care about",
            answer: "Bringing music education to underfunded schools",
          },
          {
            question: "My ideal weekend",
            answer:
              "Record shopping, trying a new brunch spot, and ending with a live gig",
          },
        ],
        pictures: [
          "https://picsum.photos/id/1062/400",
          "https://picsum.photos/id/1035/400",
          "https://picsum.photos/id/1036/400",
          "https://picsum.photos/id/1037/400",
        ],
      },
      {
        id: "4",
        name: "David Wilson",
        avatar: "https://picsum.photos/id/1074/200",
        lastMessage: "What's your favorite outdoor activity?",
        timestamp: "2024-08-02T15:10:00Z",
        bio: "Environmental scientist and weekend warrior. Happiest when I'm surrounded by nature.",
        age: 30,
        location: "Denver, CO",
        prompts: [
          {
            question: "My bucket list",
            answer: "Hike the Pacific Crest Trail from start to finish",
          },
          {
            question: "Best travel advice I've received",
            answer: "Always pack a reusable water bottle and a good attitude",
          },
          {
            question: "A random fact I love",
            answer: "Honeybees can recognize human faces",
          },
        ],
        pictures: [
          "https://picsum.photos/id/1074/400",
          "https://picsum.photos/id/1038/400",
          "https://picsum.photos/id/1039/400",
          "https://picsum.photos/id/1040/400",
        ],
      },
      {
        id: "5",
        name: "Eva Brown",
        avatar: "https://picsum.photos/id/1069/200",
        lastMessage: "Can't wait to meet you at the event!",
        timestamp: "2024-08-01T22:05:00Z",
        bio: "Yoga instructor and tea connoisseur. Seeking balance in life and love.",
        age: 29,
        location: "Los Angeles, CA",
        prompts: [
          {
            question: "My perfect morning routine",
            answer: "Sunrise yoga, meditation, and a cup of Oolong tea",
          },
          {
            question: "A skill I want to learn",
            answer: "Aerial silks - it looks so graceful and challenging!",
          },
          {
            question: "My happy place",
            answer: "On my yoga mat, preferably on a beach at sunset",
          },
        ],
        pictures: [
          "https://picsum.photos/id/1069/400",
          "https://picsum.photos/id/1041/400",
          "https://picsum.photos/id/1042/400",
          "https://picsum.photos/id/1043/400",
        ],
      },
      {
        id: "6",
        name: "Frank Lee",
        avatar: "https://picsum.photos/id/1072/200",
        lastMessage: "Do you have any song requests?",
        timestamp: "2024-08-01T14:30:00Z",
        bio: "DJ and electronic music producer. Life's better with a good beat!",
        age: 34,
        location: "Miami, FL",
        prompts: [
          {
            question: "My favorite way to unwind",
            answer: "Creating new mixes in my home studio",
          },
          {
            question: "A fun fact about me",
            answer: "I once DJed for 24 hours straight for charity",
          },
          {
            question: "My ideal partner",
            answer:
              "Someone who appreciates good music and isn't afraid to dance",
          },
        ],
        pictures: [
          "https://picsum.photos/id/1072/400",
          "https://picsum.photos/id/1044/400",
          "https://picsum.photos/id/1045/400",
          "https://picsum.photos/id/1046/400",
        ],
      },
    ];
    setMatches(dummyMatches);
  }, []);

  const handleChatClick = (match) => {
    setSelectedMatch(match);
    setChatModalVisible(true);
    // Fetch chat history (using dummy data for now)
    const dummyChatHistory = [
      {
        sender: match.id,
        content: "Hi there!",
        timestamp: "2024-08-03T08:00:00Z",
      },
      {
        sender: "user",
        content: "Hello! Nice to meet you.",
        timestamp: "2024-08-03T08:05:00Z",
      },
      {
        sender: match.id,
        content: "Are you going to the music festival?",
        timestamp: "2024-08-03T08:10:00Z",
      },
      {
        sender: "user",
        content: "Yes, I am! Can't wait!",
        timestamp: "2024-08-03T08:15:00Z",
      },
    ];
    setChatMessages(dummyChatHistory);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newChatMessage = {
        sender: "user",
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage("");
      message.success("Message sent successfully");
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
                    <p className="text-xs text-gray-500">
                      {new Date(match.timestamp).toLocaleString()}
                    </p>
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
              <Button icon={<CloseOutlined />} onClick={handleViewProfile}>
                Unmatch
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
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === "user"
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
            <p className="text-gray-500 mb-2">
              {selectedMatch.age} • {selectedMatch.location}
            </p>
            <p className="mb-4">{selectedMatch.bio}</p>

            {selectedMatch.prompts.map((prompt, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{prompt.question}</p>
                <p>{prompt.answer}</p>
              </div>
            ))}

            <Image.PreviewGroup>
              <div className="grid grid-cols-2 gap-2">
                {selectedMatch.pictures.map((pic, index) => (
                  <Image
                    key={index}
                    src={pic}
                    alt={`${selectedMatch.name}'s picture`}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
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
