import React, { useEffect, useState } from "react";
import { Table, Avatar, Rate, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getProducts, getUserReviews } from "../features/product/productSlice";

const { Search } = Input;
const { Option } = Select;

const ReviewList = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getUserReviews({ current: 1, pageSize: 120 }));
  }, [dispatch]);

  const products = useSelector((state) => state.product.products);
  const reviews = useSelector((state) => state.product.userReviews);

  const productMap = products.reduce((acc, product) => {
    acc[product._id] = {
      name: product.name,
      image: product.images?.[0],
    };
    return acc;
  }, {});

  const groupedReviews = reviews.reduce((acc, review) => {
    const pid = review.productId;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(review);
    return acc;
  }, {});

const dataSource = Object.entries(groupedReviews)
  .map(([productId, reviews], index) => {
    const latestReviewTime = Math.max(...reviews.map(r => new Date(r.createdAt).getTime()));
    return {
      key: index,
      productId,
      productName: productMap[productId]?.name || "Không rõ",
      productImage: productMap[productId]?.image,
      reviews,
      latestReviewTime
    };
  })
  .filter(item => item.productName.toLowerCase().includes(searchText.toLowerCase()))
  .sort((a, b) => b.latestReviewTime - a.latestReviewTime); // sắp xếp mới -> cũ

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {record.productImage && (
            <img
              src={record.productImage}
              alt="product"
              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
            />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Tổng số đánh giá",
      dataIndex: "reviews",
      key: "reviews",
      render: (reviews) => reviews.length,
    },
  ];

  return (
    <div>
      {/* CSS trực tiếp chỉnh màu pagination */}
      <style>
     {`
     .ant-pagination-item a {
          color: white !important;
     }

     .ant-pagination-item-active a {
          color: white !important;
     }

     .ant-pagination-item-active {
          background-color: #1890ff !important;
          border-color: #1890ff !important;
     }

     .ant-pagination-next .ant-pagination-item-link,
     .ant-pagination-prev .ant-pagination-item-link {
          color: white !important;
          border: 1px solid #444 !important;
     }
     `}
     </style>


      <h3 style={{ marginBottom: 16, color:"#fff" }}>Danh sách đánh giá sản phẩm</h3>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#fff" }}>Hiển thị:</span>
          <Select defaultValue={10} style={{ width: 80 }} onChange={(value) => setPageSize(value)}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
          </Select>
        </div>
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize }}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              {record.reviews.map((review) => (
                <div key={review._id} style={{ marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar src={review.userId?.avatar} />
                    <strong>{review.userId?.name}</strong>
                    <Rate disabled value={review.rating} />
                    <span style={{ color: "#888" }}>{moment(review.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                  </div>
                  <p style={{ marginTop: 8 }}>{review.comment}</p>
                  {review.fileUrl?.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {review.fileUrl.map((url, idx) => (
                        <img key={idx} src={url} alt="review" style={{ width: 100, borderRadius: 4 }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ),
          rowExpandable: (record) => record.reviews.length > 0,
        }}
      />
    </div>
  );
};

export default ReviewList;
