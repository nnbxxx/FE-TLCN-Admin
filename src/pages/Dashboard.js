import React, { useEffect, useState } from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getMonthlyData,
  getOrders,
  getYearlyData,
} from "../features/auth/authSlice";
import { getInforDashBoard } from "../utils/api";
import { Link } from "react-router-dom";
const data = [
  { type: "product1", value: 0.16 },
  { type: "product2", value: 0.125 },
  { type: "product3", value: 0.24 },
  { type: "product4", value: 0.19 },
  { type: "product5", value: 0.22 },
  { type: "product6", value: 0.05 },
  { type: "product7", value: 0 },
  { type: "produc8", value: 0.015 },
];
const configx = {
  data,
  xField: "type",
  yField: "value",
  // color: "#FF5733",

  label: {
    text: (originData) => {
      return originData.value;
    },
    offset: 10,
    textBaseline: "bottom",
  },
  shapeField: "hollow",
  colorField: "type",
  legend: {
    color: { size: 72, autoWrap: true, maxRows: 3, cols: 4 },
  },
  axis: {
    y: {
      // tick: false,
      // title: false,
    },
    x: {
      grid: false,
      tick: false,
      label: false,
      // title: false,
    },
  },
};
const Dashboard = () => {
  const dispatch = useDispatch();

  const [dataInitDashBorad, setDataInitDashBorad] = useState();
  useEffect(() => {
    dispatch(getOrders("current=1&pageSize=10&sort=-createdAt"));
  }, []);

  const colors = [
    "#ffd333",
    "#ff6347",
    "#4682b4",
    "#32cd32",
    "#ffa07a",
    "#6a5acd",
    "#ff69b4",
    "#20b2aa",
    "#ffb6c1",
    "#87cefa",
  ];

  const getInfoDashBoard = async () => {
    const re = await getInforDashBoard();
    if (re && re.data) {
      setDataInitDashBorad(re.data);
    }
  };
  useEffect(() => {
    getInfoDashBoard();
    return () => {};
  }, []);
  const orderState = useSelector((state) => state?.auth?.orders);
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (index, item) => {
        return item?.createdBy.email;
      },
    },
    {
      title: "Product",
      dataIndex: "product",
      sorter: (a, b) => a.amount - b.amount,
      render: (index, item) => {
        return <Link to={`/admin/order/${item?._id}`}>View Orders</Link>;
      },
    },
    {
      title: "Amount",
      dataIndex: "total",
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (index, item) => {
        return new Date(item?.createdAt).toLocaleString();
      },
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
    },
    {
      title: "Order Status",
      dataIndex: "statusUser",
      sorter: (a, b) => a.statusUser.localeCompare(b.statusUser),
    },
  ];
  return (
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Tổng doanh thu Sắc</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBorad && dataInitDashBorad?.totalRevenue
                ? dataInitDashBorad?.totalRevenue.toLocaleString("vi-VN")
                : 0}
              ₫
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng sản phẩm đã bán</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBorad && dataInitDashBorad?.totalProductPruchased}
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng người dùng</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBorad && dataInitDashBorad?.quantityUser}
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng bài viết</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBorad && dataInitDashBorad?.quantityBlog}
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng thương hiệu</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBorad && dataInitDashBorad?.quantityBlog}
            </h4>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items gap-3">
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-5 title">Thu nhập </h3>
          <div>
            <Column {...configx} />
          </div>
        </div>
        <div className="mt-4 flex-grow-1 ">
          <h3 className="mb-5 title">Doanh số </h3>
          <div>
            <Column {...configx} />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-5 title">Đơn hàng gần đây</h3>
        <div>
          <Table columns={columns} dataSource={orderState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
