import React, { useEffect, useState } from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { DatePicker, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getMonthlyData,
  getOrders,
  getYearlyData,
} from "../features/auth/authSlice";
import { getDataRevenue, getInforDashBoard } from "../utils/api";
import { Link } from "react-router-dom";
import moment from "moment/moment";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(2024);
  const onChange = (date, dateString) => {
    setYear(+dateString);
  };
  const [configTopSeller, setConfigTopSeller] = useState({
    data: [],
    xField: "name",
    yField: "totalQuantityBought",

    label: {
      text: (originData) => {
        return originData.totalQuantityBought;
      },
      offset: 10,
      textBaseline: "bottom",
    },
    shapeField: "hollow",
    colorField: "name",
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
  });
  const [configRevenue, setConfigRevenue] = useState({
    data: [],
    xField: "month",
    yField: "value",

    label: {
      text: (originData) => {
        return originData.value;
      },
      offset: 10,
      textBaseline: "bottom",
    },
    shapeField: "hollow",
    colorField: "month",
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
  });
  const [dataInitDashBoard, setDataInitDashBoard] = useState();
  useEffect(() => {
    dispatch(getOrders("current=1&pageSize=10&sort=-createdAt"));
  }, []);

  const getInfoDashBoard = async () => {
    const re = await getInforDashBoard();
    if (re && re.data) {
      setDataInitDashBoard(re.data);
      setConfigTopSeller({
        ...configTopSeller,
        data: re.data.dataTopSellingProducts,
      });
    }
  };
  useEffect(() => {
    getInfoDashBoard();
    return () => {};
  }, []);
  const callGetDataRevenue = async () => {
    const reDataRevenue = await getDataRevenue({
      year: year,
    });
    if (reDataRevenue && reDataRevenue.data) {
      setConfigRevenue({
        ...configRevenue,
        data: reDataRevenue.data,
      });
    }
  };
  useEffect(() => {
    callGetDataRevenue();
    return () => {};
  }, [year]);
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
              {dataInitDashBoard && dataInitDashBoard?.totalRevenue
                ? dataInitDashBoard?.totalRevenue.toLocaleString("vi-VN")
                : 0}
              ₫
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng sản phẩm đã bán</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBoard && dataInitDashBoard?.totalProductPruchased}
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng người dùng</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBoard && dataInitDashBoard?.quantityUser}
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng bài viết</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBoard && dataInitDashBoard?.quantityBlog}
            </h4>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Số lượng thương hiệu</p>
            <h4 className="mb-0 sub-title">
              {dataInitDashBoard && dataInitDashBoard?.quantityBrand}
            </h4>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items gap-3">
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-5 title">10 sản phẩm bán nhiều nhất</h3>
          <div>
            <Column {...configTopSeller} />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items gap-3">
        <div className="mt-4 flex-grow-1 ">
          <h3 className="mb-5 title">Doanh số </h3>
          <DatePicker
            onChange={onChange}
            picker="year"
            defaultValue={moment(year.toString(), "YYYY")}
          />
          <div>
            <Column {...configRevenue} />
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
