import React, { useEffect } from "react";
import { Table, Card, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getaOrder } from "../features/auth/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
    //width: 50,
  },
  {
    title: "Product Name",
    dataIndex: "name",
   // width: 200,
  },
  {
    title: "Brand",
    dataIndex: "brand",
    //width: 150,
  },
  {
    title: "Count",
    dataIndex: "count",
    //width: 100,
   // align: "center",
  },
  {
    title: "Color",
    dataIndex: "color",
   // width: 100,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    //width: 100,
    //align: "center",
  },
  {
    title: "Image",
    dataIndex: "image",
    //width: 150,
  },
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
        name: orderState.items[i]?.product?.name,
        brand: orderState.items[i]?.product?.brand,
        count: orderState.items[i]?.quantity,
        amount: `${orderState.items[i]?.price.toLocaleString()} đ`,
        color: (
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: orderState.items[i]?.color?.color,
              margin: "auto",
            }}
          ></div>
        ),
        image: (
          <img
            src={orderState.items[i]?.product?.images[0]}
            alt="product"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        ),
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
