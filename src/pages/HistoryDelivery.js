import React, { useEffect, useState } from "react";
import { Input, Select, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders } from "../features/auth/authSlice";
import { FaSyncAlt } from "react-icons/fa";
import moment from "moment/moment";

const { Search } = Input;
const { Option } = Select;

const HistoryDelivery = () => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state?.auth?.orders);

  // Sắp xếp đơn hàng theo thứ tự mới nhất
  const sortedOrders = orderState
    ?.filter(
      (order) =>
        order.statusSupplier === "ON_DELIVERY" ||
        order.statusSupplier === "DELIVERED"
    )
    ?.slice()
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
//     {
//       title: "Name",
//       dataIndex: "name",
//       sorter: (a, b) => a.name.localeCompare(b.name),
//       render: (index, item) => {
//         const name = item?.createdBy?.email || "N/A";
//         return (
//           <span title={name}>
//             {name.length > 15 ? `${name.slice(0, 15)}...` : name}
//           </span>
//         );
//       },
//     },
{
     title: "Product",
     dataIndex: "items",
     sorter: (a, b) => a.amount - b.amount,
     render: (items, order) => {
       const firstItem = items?.[0];
       const productImage = firstItem?.product?.images?.[0];
       const productName = firstItem?.product?.name || "Unknown Product";
   
       // Giới hạn tên sản phẩm
       const displayName =
         productName.length > 20 ? productName.slice(0, 20) + "..." : productName;
   
       return (
         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
           {productImage ? (
             <img
               src={productImage}
               alt={productName}
               style={{
                 width: "50px",
                 height: "50px",
                 objectFit: "cover",
                 borderRadius: "5px",
               }}
             />
           ) : (
             <div
               style={{
                 width: "50px",
                 height: "50px",
                 backgroundColor: "#f0f0f0",
                 borderRadius: "5px",
               }}
             />
           )}
           <Link
             to={`/admin/order/${order?._id}`}
             style={{ fontWeight: "bold", color: "#1890ff" }}
             title={productName}
           >
             {displayName}
           </Link>
         </div>
       );
     },
   },
   {
     title: "Quantity",
     dataIndex: "items",
     render: (items) => {
       const firstItem = items?.[0];
       const quantity = firstItem?.quantity || 0;
       return <span>{quantity}</span>;
     },
   },
   {
     title: "Color",
     dataIndex: "items",
     render: (items) => {
       const firstItem = items?.[0];
       const colorId = firstItem?.color?._id || "#000000"; // Nếu không có màu thì hiển thị đen
       return (
         <div
           style={{
             width: "20px",
             height: "20px",
             backgroundColor: colorId,
             borderRadius: "50%",
             border: "1px solid #ddd",
           }}
           title={colorId}
         />
       );
     },
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
     title: "Updated At",
     dataIndex: "updatedAt",
     sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
     render: (index, item) => {
       return new Date(item?.updatedAt).toLocaleString();
     },
   },
    {
      title: "Order Status",
      dataIndex: "statusUser",
      sorter: (a, b) => a.statusUser.localeCompare(b.statusUser),
      render: (status) => {
        let color = "";
        switch (status) {
          case "ON_DELIVERY":
            color = "orange";
            break;
          case "DELIVERED":
            color = "blue";
            break;
          default:
            color = "gray";
        }
        return (
          <span style={{ color, fontWeight: "bold" }}>
            {status}
          </span>
        );
      },
    },
    
  ];

  const orders = useSelector((state) => state.auth?.orders);
  const latestOrders =
    orders.length > 0
      ? orders.reduce((latest, order) =>
          new Date(order.createdAt) > new Date(latest.createdAt)
            ? order
            : latest
        )
      : null;

  const orderStatuses = [
    ...new Set(
      orders
        ?.filter(
          (order) =>
            order.statusSupplier === "ON_DELIVERY" ||
            order.statusSupplier === "DELIVERED"
        )
        ?.map((order) => order.statusSupplier)
    ),
  ];

  // Lọc đơn hàng
  const filteredOrders = orders
    ?.filter(
      (order) =>
        (selectedCategory
          ? order.statusSupplier === selectedCategory
          : true) &&
        (order.statusSupplier === "ON_DELIVERY" ||
          order.statusSupplier === "DELIVERED") &&
        (searchText
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
          : true)
    )
    ?.slice()
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mx-4 py-3">
          <h3 className="m-0">Danh sách lịch sử xuất hàng</h3>
          {latestOrders && (
            <span className="text-muted fs-6 d-flex align-items-center">
              Dữ liệu mới nhất
              <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
              <span className="ms-2 border px-2 py-1 rounded">
                {moment(latestOrders.createdAt).format(
                  "HH:mm:ss DD/MM/YYYY"
                )}
              </span>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ marginRight: 8, color: "white" }}>Hiển thị:</span>
          <Select defaultValue={10} style={{ width: 60 }} onChange={(value) => setPageSize(value)}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
          </Select>
        </div>

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

      <Table
        className="compact-table"
        columns={columns}
        dataSource={filteredOrders || []}
        rowKey={(record) => record._id || record.key}
        pagination={{
          pageSize,
          showSizeChanger: false,
         showTotal: (total, range) => (
            <span style={{ color: "white" }}>
              {range[0]}-{range[1]} trong tổng số {total} đơn hàng
            </span>
          )

        }}
      />
    </div>
  );
};

export default HistoryDelivery;
