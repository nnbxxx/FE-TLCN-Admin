import React, { useEffect, useState } from "react";
import { Input, Select, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";
import { FaSyncAlt } from "react-icons/fa";
import moment from "moment/moment";
const { Search } = Input;

const { Option } = Select;
const Orders = () => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchText, setSearchText] = useState("");
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

 const oders = useSelector((state) => state.auth?.orders);
  const latestoders = oders.length > 0 
    ? oders.reduce((latest, customer) => 
        new Date(customer.createdAt) > new Date(latest.createdAt) ? customer : latest
      )
    : null;
 // Lấy danh sách danh mục (không trùng lặp)
 const orderStatuses = [...new Set(oders?.map((oders) => oders.statusSupplier))];

 // Lọc sản phẩm theo danh mục hoặc tìm kiếm
 const filteredoder = oders?.filter((order) => {
  const matchesCategory = selectedCategory ? order.statusSupplier === selectedCategory : true;
  
  const matchesSearch = searchText
    ? [
        order?._id,
        order?.createdBy?.email,
        order?.product?.name,
        order?.total,
        order?.paymentMethod,
        order?.statusUser,
      ].some((value) =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    : true;

  return matchesCategory && matchesSearch;
});

  return (
    <div>
    <div className="bg-white p-3 rounded shadow-sm mb-4">
      <div className="d-flex justify-content-between align-items-center mx-4 py-3">
        <h3 className="m-0">Danh sách đặt hàng</h3>
          {latestoders && (
            <span className="text-muted fs-6 d-flex align-items-center">
              Dữ liệu mới nhất
              <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
            <span className="ms-2 border px-2 py-1 rounded">
                {moment(latestoders.createdAt).format("HH:mm:ss DD/MM/YYYY")}
            </span>
            </span>
           )}
          </div>
      </div> 


      {/* Bộ lọc và tìm kiếm */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              {/* Phần "Hiển thị" nằm bên trái */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ marginRight: 8 }}>Hiển thị:</span>
                <Select
                        defaultValue={10}
                        style={{ width: 60 }}
                        onChange={(value) => setPageSize(value)}
                      >
                          <Option value={5}>5</Option>
                          <Option value={10}>10</Option>
                          <Option value={20}>20</Option>
                          <Option value={50}>50</Option>
                    </Select>
              </div>

              {/* Phần danh mục và tìm kiếm nằm bên phải */}
              <div style={{ display: "flex", gap: "10px" }}>
                <Select
                  placeholder="Lọc theo trạng thái"
                  allowClear
                  style={{ width: "170px" }}
                  onChange={(value) => setSelectedCategory(value)}
                >
                  {orderStatuses.map((status) => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>

                <Search
                  placeholder="Tìm kiếm..."
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: "210px" }}
                />
              </div>
      </div>                     

      <div>{
        <Table columns={columns} 
          // dataSource={sortedOrders} 
          dataSource={(filteredoder || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
          rowKey={(record) => record._id || record.key}
          pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} đơn hàng`,
        }}

      />}</div>
    </div>
  );
};

export default Orders;
