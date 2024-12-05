import instance from "./axios-customize";

export const getInforDashBoard = () => {
  return instance.get(`dashboard/info`);
};
export const getDataRevenue = (data) => {
  return instance.post(`dashboard/revenue`, data);
};
