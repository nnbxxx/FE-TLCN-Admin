import instance from './axios-customize';

export const getInforDashBoard = () => {
  return instance.get(`dashboard/info`);
};
export const getDataRevenue = (data) => {
  return instance.post(`dashboard/revenue`, data);
};

export const uploadImg = async (data) => {
  const formData = new FormData();
  formData.append('files', data);
  const response = await instance.patch(`files/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};
