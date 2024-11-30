import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

import instance from "../../utils/axios-customize";

const uploadImg = async (data) => {
  const response = await instance.patch(`files/files`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
const deleteImg = async (id) => {
  const response = await axios.delete(
    `${base_url}upload/delete-img/${id}`,

    config
  );
  return response.data;
};

const uploadService = {
  uploadImg,
  deleteImg,
};

export default uploadService;
