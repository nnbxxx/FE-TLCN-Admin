import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layout,
  List,
  Avatar,
  Typography,
  Button,
  Input,
  Divider,
  Tooltip,
} from 'antd';
import { FaSyncAlt } from 'react-icons/fa';
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { MessageService } from '../features/message/messageService';
import { toast } from 'react-toastify';
import { formatMessageTime } from '../utils/dayUltils';
import IconButtonUpload from '../components/IconButtonUpload';

const { Sider, Content } = Layout;
const { Title } = Typography;

const Messages = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [message, setMessage] = useState('');

  const authState = useSelector((state) => state?.auth?.user);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      return;
    }

    // fetch chat rooms
    const fetchChatRooms = async () => {
      const chatRoomsRes = await MessageService.getAllChatRooms();
      if (chatRoomsRes.error) {
        toast('Unknown error');
        return;
      }

      setChatRooms(chatRoomsRes.data.result);
    };
    fetchChatRooms();

    const newSocket = io(
      process.env.REACT_APP_SOCKET_URL || 'http://localhost:3006',
      {
        extraHeaders: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      },
    );

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server with token');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.disconnect(); // Disconnect the socket on unmount
    };
  }, [token]);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = async ({ file }) => {
    if (file.status === 'done') {
      console.log(file);
      await MessageService.sendMessage({
        content: '',
        chatRoom: selectedChatRoom._id,
        messageType: 'file',
        fileUrl: [file.fileUrl],
      });
    }
  };

  const handleSelectChatRoom = useCallback(
    async (newChatRoom) => {
      const res = await MessageService.joinChatRoom(newChatRoom._id);
      if (res.error) {
        toast('Unknown error');
        return;
      }

      const messagesRes = await MessageService.getMesasges(newChatRoom._id);
      if (messagesRes.error) {
        toast('Unknown error');
        return;
      }
      setMessages(messagesRes.data.result);

      setSelectedChatRoom(newChatRoom);

      if (selectedChatRoom) {
        socket.off(`chat-rooms/${selectedChatRoom._id}`);
      }
      socket.on(`chat-rooms/${newChatRoom._id}`, (newMsg) => {
        console.log('new msg', newMsg);
        setMessages((messages) => [...messages, newMsg]);
      });
    },
    [selectedChatRoom, socket],
  );

  const handleSendMessage = useCallback(async () => {
    await MessageService.sendMessage({
      content: message,
      chatRoom: selectedChatRoom._id,
      messageType: 'text',
      fileUrl: [],
    });
    setMessage(''); // Clear the input field
  }, [message, selectedChatRoom]);

  const handleUploadFile = () => {
    console.log('Upload file clicked!');
    // Implement file upload functionality here
  };

  const renderMessages = () => {
    if (!selectedChatRoom) {
      return <div>Please select a group to start chatting.</div>;
    }

    return (
      <MessagesContainer ref={chatContainerRef}>
        {messages?.map((msg, index) => {
          const isSystem = msg.isSystem;
          const isCurrentUser =
            msg.sender &&
            (msg.sender === authState._id || msg.sender._id === authState._id);

          return (
            <MessageWrapper
              key={index}
              isCurrentUser={isCurrentUser}
              isSystem={isSystem}
            >
              <MessageBubble isCurrentUser={isCurrentUser} isSystem={isSystem}>
                <MessageSender>
                  <p className="my-1">
                    <strong>
                      {isSystem
                        ? 'Hệ thống'
                        : isCurrentUser
                        ? 'Bạn'
                        : msg.sender?.name}
                    </strong>
                  </p>
                  <p className="my-1 ms-2">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </MessageSender>
                {msg.messageType === 'file' && (
                  <a
                    href={msg.fileUrl[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block' }} // Make the link fill the container
                    className="mb-3"
                  >
                    <img
                      src={msg.fileUrl}
                      style={{
                        maxWidth: '200px',
                        height: 'auto',
                        borderRadius: '5px',
                      }}
                    />
                  </a>
                )}
                {msg.messageType === 'text' && (
                  <MessageText isSystem={isSystem}>{msg.content}</MessageText>
                )}
              </MessageBubble>
            </MessageWrapper>
          );
        })}
        <div ref={messagesEndRef} /> {/* This is where the scroll will land */}
      </MessagesContainer>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <StyledSider
        // width={400}
        style={{
          background: '#fff',
          padding: '10px',
          boxShadow: '2px 0px 15px rgba(0,0,0,0.1)',
          overflowY: 'auto',
        }}
      >
        <Title level={3} className="text-center">
          Group Chats
        </Title>
        <List
          bordered
          dataSource={chatRooms}
          renderItem={(chatRoom) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '12px',
                transition: 'background 0.3s',
              }}
              onClick={() => handleSelectChatRoom(chatRoom)}
              hoverable
            >
              <List.Item.Meta
                title={chatRoom.roomName}
                description={chatRoom.lastMessage?.content || ''}
              />
            </List.Item>
          )}
          style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
        />
      </StyledSider>

      <Layout style={{ padding: '0 24px 24px', flex: 1 }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedChatRoom ? (
            <>
              <div
                style={{
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                {selectedChatRoom.roomName}
              </div>
              <Divider />

              {renderMessages()}

              <Divider />

              <MessageInput>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onPressEnter={handleSendMessage}
                  placeholder="Type a message..."
                  style={{ width: '70%' }}
                />
                <ActionIcons>
                  <IconButtonUpload onChange={handleImageUpload} />
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
const StyledSider = styled(Sider)`
  width: 400px !important;
  max-height: calc(100vh - 250px);
  background: linear-gradient(
    135deg,
    #e0f7fa 0%,
    #c2e9f2 100%
  ); /* Soft gradient background */
  padding: 25px;
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.1); /* More pronounced shadow */
  overflow-y: auto;
  border-right: 1px solid #b0bec5; /* Subtle right border */

  .ant-typography-title {
    color: #263238; /* Darker, more prominent title */
    margin-bottom: 25px;
    font-size: 1.8em;
    font-weight: 600;
  }

  .ant-list-bordered {
    border: none;
  }

  .ant-list-item {
    cursor: pointer;
    padding: 18px 22px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smoother transition */
    border-radius: 12px; /* More rounded corners */
    margin-bottom: 12px;
    background-color: #fff; /* White background for list items */
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08); /* Subtle shadow on items */
    border: none;

    &:hover {
      transform: translateY(-2px); /* Slight lift on hover */
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12); /* Enhanced hover shadow */
      background-color: #f0f4c3; /* Light yellow/green on hover */
    }

    .ant-list-item-meta {
      align-items: center;
    }

    .ant-list-item-meta-avatar {
      margin-right: 20px;
    }

    .ant-avatar {
      background-color: #64b5f6 !important; /* Brighter avatar background */
      color: #fff !important;
      font-size: 1.2em;
    }

    .ant-list-item-meta-title {
      color: #37474f; /* Darker title in list item */
      font-weight: 500;
      margin-bottom: 8px;
    }

    .ant-list-item-meta-description {
      color: #546e7a; /* More distinct description text */
      font-size: 0.95em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .ant-list-container {
    max-height: calc(100vh - 170px); /* Adjust max-height */
    overflow-y: auto;
    padding-right: 5px; /* Add a little space for the scrollbar */
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: #b0bec5 #f5f5f5; /* For Firefox */

    /* For Chrome, Edge, and Safari */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #b0bec5;
      border-radius: 4px;
    }
  }
`;

const MessagesContainer = styled.div`
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  padding-right: 10px;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.isSystem
      ? 'center'
      : props.isCurrentUser
      ? 'flex-end'
      : 'flex-start'};
  padding: 10px;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 12px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.isSystem ? '#f8f8f8' : props.isCurrentUser ? '#d1f7c4' : '#f0f0f0'};
  border: ${(props) => (props.isSystem ? '1px solid #eee' : '1px solid #ddd')};
  box-shadow: ${(props) =>
    props.isCurrentUser ? '0px 4px 6px rgba(0,0,0,0.1)' : 'none'};
  position: relative;
  margin-bottom: 10px;
  color: ${(props) => (props.isSystem ? '#777' : 'black')};
  font-style: ${(props) => (props.isSystem ? 'italic' : 'normal')};
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
  font-size: ${(props) => (props.isSystem ? '0.75em' : '1em')};
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
