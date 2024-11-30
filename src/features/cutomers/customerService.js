import instance from "../../utils/axios-customize";

const getUsers = async () => {
  const response = await instance.get(`users`);
  return response;
};

const blockUser = async (Id) => {
  const response = await instance.patch(`users/block/${Id}`);
  return response;
};

const unblockUser = async (Id) => {
  const response = await instance.patch(`users/block/${Id}`);
  return response;
};

const updateUser = async (data) => {
  const { _id, role } = data;
  const response = await instance.patch(`users/${_id}`, {
    role: role,
  });
  return response;
};

const customerService = {
  getUsers,
  blockUser,
  unblockUser,
  updateUser,
};

export default customerService;
