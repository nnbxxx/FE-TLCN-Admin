import { SendOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  Input,
  Layout,
  List,
  Tooltip,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import IconButtonUpload from '../components/IconButtonUpload';
import { MessageService } from '../features/message/messageService';
import { formatMessageTime } from '../utils/dayUltils';

const { Sider, Content } = Layout;
const { Title } = Typography;

const answers = [
  { id: 1, answer: 'Câu trả lời 1' },
  { id: 2, answer: 'Câu trả lời 2' },
  { id: 3, answer: 'Câu trả lời 3' },
];

function moveToFirst(arr, inputId) {
  const index = arr.findIndex((obj) => obj._id === inputId);
  if (index > -1) {
    const [item] = arr.splice(index, 1);
    arr.unshift(item);
  }
  return arr;
}

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

    const fetchChatRooms = async () => {
      const chatRoomsRes = await MessageService.getAllChatRooms();
      if (chatRoomsRes.error) {
        toast('Unknown error');
        return;
      }

      const chatRooms = chatRoomsRes.data.result;
      setChatRooms(chatRooms);
    };
    fetchChatRooms();
    const newSocket = io('https://demo-deploy-be.onrender.com', {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSocket(newSocket);
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    socket?.off();

    socket?.on('new-chat-room', (newChatRoom) => {
      setChatRooms([newChatRoom, ...chatRooms]);
    });

    chatRooms.forEach((chatRoom) => {
      const chatRoomId = chatRoom._id;
      socket.on(`chat-rooms/${chatRoomId}`, (newMsg) => {
        console.log('new message', newMsg);
        const newChatRooms = moveToFirst(chatRooms, newMsg.chatRoom);
        if (selectedChatRoom?._id === newMsg.chatRoom) {
          setMessages((messages) => [...messages, newMsg]);
        } else {
          newChatRooms[0].lastMessage = { ...newMsg, isNew: true };
        }

        console.log('new chat roms', newChatRooms);
        setChatRooms([...newChatRooms]);
        if (newMsg.questionId) {
          const found = answers.find(
            (answer) => answer.id === newMsg.questionId,
          );
          if (found) {
            const autoReply = {
              content: found.answer,
              chatRoom: newMsg.chatRoom,
              messageType: 'text',
              isCurrentUser: true,
              fileUrl: [],
              createdAt: new Date().toISOString(),
            };
            setTimeout(async () => {
              setMessages((prev) => [...prev, autoReply]);
              await MessageService.sendMessage({
                content: found.answer,
                chatRoom: newMsg.chatRoom,
                messageType: 'text',
                fileUrl: [],
              });
            }, 1000);
          }
        }
      });
    });
  }, [chatRooms, selectedChatRoom?._id, socket, token]);

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

      const index = chatRooms.findIndex((e) => e._id === newChatRoom._id);

      if (index >= 0 && chatRooms[index].lastMessage?.isNew) {
        // Create a new lastMessage object with isNew set to false
        const updatedLastMessage = {
          ...chatRooms[index].lastMessage,
          isNew: false,
        };

        const updatedChatRoom = {
          ...chatRooms[index],
          lastMessage: updatedLastMessage,
        };

        const newChatRooms = [
          ...chatRooms.slice(0, index),
          updatedChatRoom,
          ...chatRooms.slice(index + 1),
        ];

        setChatRooms(newChatRooms);
      }
    },
    [chatRooms],
  );

  const handleSendMessage = useCallback(async () => {
    await MessageService.sendMessage({
      content: message,
      chatRoom: selectedChatRoom._id,
      messageType: 'text',
      fileUrl: [],
    });
    setMessage('');
  }, [message, selectedChatRoom]);

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
              <Tooltip
                placement={isCurrentUser ? 'left' : 'right'}
                title={formatMessageTime(msg.createdAt)}
              >
                <MessageBubble
                  isCurrentUser={isCurrentUser}
                  isSystem={isSystem}
                >
                  {msg.messageType === 'file' && (
                    <a
                      href={msg.fileUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block' }}
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
              </Tooltip>
            </MessageWrapper>
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>
    );
  };

  return (
    <Layout style={{ flex: 1, height: '100%', minHeight: 'unset', padding: 0 }}>
      <StyledSider
        style={{
          background: '#fff',
          padding: '10px',
          boxShadow: '2px 0px 15px rgba(0,0,0,0.2)',
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
                // Apply a different background if this chat room is selected
                backgroundColor:
                  selectedChatRoom?._id === chatRoom._id
                    ? '#e6f7ff'
                    : 'transparent',
              }}
              onClick={() => handleSelectChatRoom(chatRoom)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: '#1677ff',
                      verticalAlign: 'middle',
                    }}
                    src={
                      chatRoom.members.find((e) => e.role === 'user')?.avatar
                    }
                  >
                    {chatRoom.roomName?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                }
                title={chatRoom.roomName}
                description={
                  chatRoom.lastMessage?.isNew === true ? (
                    <strong>{chatRoom.lastMessage?.content || ''}</strong>
                  ) : (
                    chatRoom.lastMessage?.content || ''
                  )
                }
              />
            </List.Item>
          )}
        />
      </StyledSider>

      <Layout style={{ flex: 1, height: '100%', minHeight: 'unset' }}>
        <Content
          style={{
            paddingLeft: '20px',
            margin: 0,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
          }}
        >
          {selectedChatRoom ? (
            <>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0px 10px 10px 10px',
                }}
              >
                <Avatar
                  src={
                    selectedChatRoom.members.find((e) => e.role === 'user')
                      ?.avatar
                  }
                  style={{ marginRight: 8 }}
                />
                <span>{selectedChatRoom.roomName}</span>
              </div>

              <Divider style={{ margin: 0 }} />
              {renderMessages()}
              <Divider />

              <MessageInput>
                <ActionIcons>
                  <IconButtonUpload onChange={handleImageUpload} />
                </ActionIcons>
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onPressEnter={handleSendMessage}
                  placeholder="Type a message..."
                  style={{ width: '90%', padding: '10px' }}
                />
                <ActionIcons>
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
            <div
              style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              Please select a group to view messages.
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

// Styled Components
const StyledSider = styled(Sider)`
  width: 400px !important;
  height: 100%;
  background: linear-gradient(135deg, #e0f7fa 0%, #c2e9f2 100%);
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #b0bec5;

  display: flex;
  flex-direction: column;

  .ant-typography-title {
    color: #263238;
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
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border-radius: 12px;
    margin-bottom: 12px;
    background-color: #fff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
      background-color: #f0f4c3;
    }

    .ant-list-item-meta {
      align-items: center;
    }

    .ant-list-item-meta-avatar {
      margin-right: 20px;
    }

    .ant-avatar {
      background-color: #64b5f6 !important;
      color: #fff !important;
      font-size: 1.2em;
    }

    .ant-list-item-meta-title {
      color: #37474f;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .ant-list-item-meta-description {
      color: #546e7a;
      font-size: 0.95em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .ant-list-container {
    flex: 1;
    overflow-y: auto;
    padding-right: 5px;
    scrollbar-width: thin;
    scrollbar-color: rgb(12, 47, 65) #f5f5f5;

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
  height: calc(100vh - 260px);
  overflow-y: auto;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.isSystem
      ? 'center'
      : props.isCurrentUser
      ? 'flex-end'
      : 'flex-start'};
  padding: 0;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px 20px;
  border-radius: 10px;
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

// const MessageSender = styled.div`
//   font-size: 12px;
//   color: #888;
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 5px;

//   span {
//     font-size: 11px;
//   }
// `;

const MessageText = styled.div`
  font-size: ${(props) => (props.isSystem ? '0.75em' : '1em')};
  line-height: 1.2;
`;

const MessageInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
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

export default Messages;
