import React, { useState, useRef, useEffect } from "react";
import { Layout, List, Avatar, Typography, Button, Input, Divider, Tooltip } from "antd";
import { FaSyncAlt } from "react-icons/fa";
import { SendOutlined, PaperClipOutlined } from "@ant-design/icons";
import moment from "moment";
import styled from "styled-components";

const { Sider, Content } = Layout;
const { Title } = Typography;

const Messages = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [groupMessages, setGroupMessages] = useState({
    1: [
      { sender: "Alice", text: "Hi, how can I help you?", time: "2025-04-27T10:00:00" },
      { sender: "Bob", text: "I have an issue with my order.", time: "2025-04-27T10:05:00" },
      { sender: "Alice", text: "Please provide your order number.", time: "2025-04-27T10:06:00" },
    ],
    2: [
      { sender: "John", text: "Let's discuss the new ad campaign.", time: "2025-04-27T09:00:00" },
      { sender: "Jane", text: "I think we should target millennials.", time: "2025-04-27T09:15:00" },
    ],
    3: [
      { sender: "Mark", text: "The latest build is ready for testing.", time: "2025-04-27T08:30:00" },
      { sender: "Sarah", text: "Great! I will start testing now.", time: "2025-04-27T08:35:00" },
    ],
  });

  const messageEndRef = useRef(null); // Reference to scroll to the bottom of the messages container
  const currentUser = "Alice"; // Replace with actual username

  const groups = [
    { id: 1, name: "Customer Support", description: "Support chat for customers" },
    { id: 2, name: "Marketing Team", description: "Team chat for marketing discussions" },
    { id: 3, name: "Development Team", description: "Chat for developers working on the app" },
  ];

  const handleSelectGroup = (group) => {
    setSelectedGroup(group); // Set the selected group chat
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: currentUser,
        text: message,
        time: new Date().toISOString(),
      };

      // Add the new message to the selected group's messages
      setGroupMessages((prevMessages) => ({
        ...prevMessages,
        [selectedGroup.id]: [...prevMessages[selectedGroup.id], newMessage],
      }));

      setMessage(""); // Clear the input field

      // Scroll to the last message
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleUploadFile = () => {
    console.log("Upload file clicked!");
    // Implement file upload functionality here
  };

  const renderMessages = () => {
    if (!selectedGroup) {
      return <div>Please select a group to start chatting.</div>;
    }

    return (
      <MessagesContainer>
        {groupMessages[selectedGroup.id]?.map((msg, index) => {
          const isCurrentUser = msg.sender === currentUser;
          return (
            <MessageWrapper key={index} isCurrentUser={isCurrentUser}>
              <MessageBubble isCurrentUser={isCurrentUser}>
                <MessageSender>
                  <strong>{msg.sender}</strong>
                  <span>{moment(msg.time).format("HH:mm")}</span>
                </MessageSender>
                <MessageText>{msg.text}</MessageText>
              </MessageBubble>
            </MessageWrapper>
          );
        })}
        <div ref={messageEndRef} /> {/* This is where the scroll will land */}
      </MessagesContainer>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        style={{
          background: "#fff",
          padding: "10px",
          boxShadow: "2px 0px 15px rgba(0,0,0,0.1)",
          overflowY: "auto",
        }}
      >
        <Title level={3}>Group Chats</Title>
        <List
          bordered
          dataSource={groups}
          renderItem={(group) => (
            <List.Item
              style={{ cursor: "pointer", padding: "12px", transition: "background 0.3s" }}
              onClick={() => handleSelectGroup(group)}
              hoverable
            >
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: "#87d068" }}>{group.name[0]}</Avatar>}
                title={group.name}
                description={group.description}
              />
            </List.Item>
          )}
          style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
        />
      </Sider>

      <Layout style={{ padding: "0 24px 24px", flex: 1 }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedGroup ? (
            <>
              <div style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>
                {selectedGroup.name}
              </div>

              {renderMessages()}

              <Divider />

              <MessageInput>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onPressEnter={handleSendMessage}
                  placeholder="Type a message..."
                  style={{ width: "70%" }}
                />
                <ActionIcons>
                  <Tooltip title="Upload a file">
                    <FileUploadButton
                      icon={<PaperClipOutlined />}
                      onClick={handleUploadFile}
                    />
                  </Tooltip>
                  <Tooltip title="Send message">
                    <SendButton
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                    />
                  </Tooltip>
                </ActionIcons>
              </MessageInput>
            </>
          ) : (
            <div>Please select a group to view messages.</div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

// Styled Components

const MessagesContainer = styled.div`
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding-right: 10px;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isCurrentUser ? "flex-end" : "flex-start")};
  padding: 10px;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 12px;
  border-radius: 20px;
  background-color: ${(props) => (props.isCurrentUser ? "#d1f7c4" : "#f0f0f0")};
  border: 1px solid #ddd;
  box-shadow: ${(props) => (props.isCurrentUser ? "0px 4px 6px rgba(0,0,0,0.1)" : "none")};
  position: relative;
  margin-bottom: 10px;
`;

const MessageSender = styled.div`
  font-size: 12px;
  color: #888;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;

  span {
    font-size: 11px;
  }
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;

const MessageInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const ActionIcons = styled.div`
  display: flex;
  align-items: center;
`;

const SendButton = styled(Button)`
  background-color: #4caf50;
  border-color: #4caf50;
  :hover {
    background-color: #45a049;
    border-color: #45a049;
  }
  margin-left: 8px;
`;

const FileUploadButton = styled(Button)`
  background-color: #f0f0f0;
  border-color: #d9d9d9;
  :hover {
    background-color: #f4f4f4;
    border-color: #bdbdbd;
  }
`;

export default Messages;
