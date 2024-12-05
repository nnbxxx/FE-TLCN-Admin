import instance from "../../utils/axios-customize";

const uploadImg = async (data) => {
  const response = await instance.patch(`files/files`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const uploadService = {
  uploadImg,
};

export default uploadService;
