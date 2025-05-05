import React, { useEffect } from "react";
import { Table, Card, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getaOrder } from "../features/auth/authSlice";

const columns = [
  { title: "SNo", dataIndex: "key" },
  {
    title: "Tên sản phẩm",
    dataIndex: "productInfo",
  },
  { title: "Thương hiệu", dataIndex: "brand" },
  { title: "Số lượng", dataIndex: "count" },
  { title: "Tổng tiền", dataIndex: "amount" },
];

const ViewOrder = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getaOrder(orderId));
  }, [dispatch, orderId]);

  const orderState = useSelector((state) => state?.auth?.singleorder);

  const data1 = [];
  if (orderState?.items) {
    for (let i = 0; i < orderState.items.length; i++) {
      data1.push({
        key: i + 1,
        productInfo: (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <img
              src={orderState.items[i]?.product?.images[0]}
              alt="product"
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
            />
            <div>
              <div style={{ fontWeight: "bold" }}>
                {orderState.items[i]?.product?.name}
              </div>
              {orderState.items[i]?.size && (
                <div style={{ fontSize: "0.85rem" }}>
                  Size: {orderState.items[i].size}
                </div>
              )}
              {orderState.items[i]?.color && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: orderState.items[i].color,
                      border: "1px solid #ccc",
                    }}
                  ></span>
                  <span style={{ fontSize: "0.85rem" }}>
                    {orderState.items[i].color}
                  </span>
                </div>
              )}
            </div>
          </div>
        ),
        brand: orderState.items[i]?.product?.brand,
        count: orderState.items[i]?.quantity,
        amount: `${orderState.items[i]?.price.toLocaleString()} đ`,
      });
      
    }
  }

  return (
    <div>
      <h2 className="mb-4 title">Chi tiết đơn hàng</h2>
      <Card className="mb-4">
        <h3>Thông tin đơn hàng</h3>
        <Divider />
        <p><strong>ID:</strong> {orderState?._id}</p>
        <p><strong>Trạng thái:</strong> {orderState?.statusUser}</p>
        <p><strong>Tổng tiền:</strong> {orderState?.total.toLocaleString()} đ</p>
        <p><strong>Ngày đặt:</strong> {new Date(orderState?.createdAt).toLocaleString()}</p>
        <p><strong>Phương thức thanh toán:</strong> {orderState?.paymentMethod}</p>
      </Card>

      <Card className="mb-4">
        <h3>Thông tin người nhận</h3>
        <Divider />
        <p><strong>Người nhận:</strong> {orderState?.address?.receiver}</p>
        <p><strong>Số điện thoại:</strong> {orderState?.address?.phone}</p>
        <p><strong>Địa chỉ:</strong></p>
        <ul>
          <li><strong>Địa chỉ cụ thể:</strong> {orderState?.address?.specific}</li>
          <li><strong>Phường/Xã:</strong> {orderState?.address?.wards}</li>
          <li><strong>Quận/Huyện:</strong> {orderState?.address?.districts}</li>
          <li><strong>Tỉnh/Thành phố:</strong> {orderState?.address?.province}</li> 
        </ul>
      </Card>

      <Card>
        <h3>Sản phẩm</h3>
        <Divider />
        <Table
          columns={columns}
          dataSource={data1}
          // pagination={false}
          // bordered
        />
      </Card>
    </div>
  );
};

export default ViewOrder;
