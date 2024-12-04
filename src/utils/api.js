import instance from "./axios-customize";

export const getInforDashBoard = () => {
  return instance.get(`dashboard/info`);
};
