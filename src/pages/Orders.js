import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { render } from "@testing-library/react";

const Orders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state?.auth?.orders);
<<<<<<< HEAD



  const updateOrderStatus = (orderId, status) => {
    dispatch(
      updateAOrder({
        _id: orderId,
        statusSupplier: status,
      })
    );
  };
=======
>>>>>>> 467c44160941790dd54c842e4ac53c2b2be24d83
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 100,
      sorter: (a, b) => a._id.localeCompare(b._id),

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
    // {
    //   title: "Order Status",
    //   dataIndex: "statusUser",
    //   sorter: (a, b) => a.statusUser.localeCompare(b.statusUser),
    // },
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
      <div>{<Table columns={columns} dataSource={orderState} />}</div>
    </div>
  );
};

export default Orders;
