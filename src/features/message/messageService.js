import instance from '../../utils/axios-customize';

const getAllChatRooms = async () => {
  return await instance.get(`admin/chat-rooms?limit=1000`);
};

const joinChatRoom = async (chatRoom) => {
  return await instance.post(`admin/chat-rooms/${chatRoom}/join`);
};

const getMesasges = async (chatRoom) => {
  return await instance.get(`message?chatRoom=${chatRoom}&limit=10000`);
};

const sendMessage = async (data) => {
  const response = await instance.post('message', data);
  return response;
};

export const MessageService = {
  getAllChatRooms,
  joinChatRoom,
  getMesasges,
  sendMessage,
};
