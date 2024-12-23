import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";

const Orders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state?.auth?.orders);

  // Sắp xếp đơn hàng theo thứ tự mới nhất
  const sortedOrders = orderState?.slice()?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 100,
      sorter: (a, b) => a._id.localeCompare(b._id),
      render: (text) => (
        <span title={text}>
          {text.length > 10 ? `${text.slice(0, 10)}...` : text}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (index, item) => {
        const name = item?.createdBy?.email || "N/A";
        return (
          <span title={name}>
            {name.length > 15 ? `${name.slice(0, 15)}...` : name}
          </span>
        );
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
      render: (status) => {
        let color = "";
        switch (status) {
          case "CONFIRMED":
            color = "green";
            break;
          case "DELIVERED":
            color = "blue";
            break;
          case "CANCEL":
            color = "red";
            break;
          case "ON_DELIVERY":
            color = "orange";
            break;
          case "PREPARE":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        return (
          <span
            style={{
              color,
              fontWeight: "bold",
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (index, item) => {
        return (
          <>
            <select
              name=""
              defaultValue={item?.orderStatus}
              onChange={(e) => updateOrderStatus(item?._id, e.target.value)}
              className="form-control form-select"
              id=""
            >
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="UNCONFIRMED">UNCONFIRMED</option>
              <option value="PREPARE">PREPARE</option>
              <option value="ON_DELIVERY">ON_DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCEL">CANCEL</option>
            </select>
          </>
        );
      },
    },
  ];

  const updateOrderStatus = (orderId, status) => {
    dispatch(
      updateAOrder({
        _id: orderId,
        statusSupplier: status,
      })
    );
  };

  return (
    <div>
      <h3 className="mb-4 title">Danh sách đặt hàng</h3>
      <div>{<Table columns={columns} dataSource={sortedOrders} />}</div>
    </div>
  );
};

export default Orders;
