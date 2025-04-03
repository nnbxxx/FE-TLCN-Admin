import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table, Modal, Checkbox } from "antd";
import { AiFillDelete, AiFillSave } from "react-icons/ai";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import moment from "moment/moment";
import { FaCheck, FaSyncAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const AddWareHouse = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5); 
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const showModal = () => setOpen(true);
  const hideModal = () => setOpen(false);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [...prev, { ...product, quantity: 1, importPrice: product.price }];
    });
  };

  const handleInputChange = (value, record, field) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item._id === record._id ? { ...item, [field]: value } : item
      )
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productColumns = [
    {
      title: "Chọn",
      dataIndex: "select",
      render: (_, item) => (
        <Checkbox
          checked={selectedProducts.some((p) => p._id === item._id)}
          onChange={() => handleSelectProduct(item)}
        />
      ),
    },
    {
     title: "Tên sản phẩm",
     dataIndex: "name",
     sorter: (a, b) => a.name.length - b.name.length,
     render: (text, record) => (
       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
         <img
           src={record.images?.[0] || "https://via.placeholder.com/50"}
           alt={text}
           style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
         />
         <span>{text.length > 20 ? text.substring(0, 35) + "..." : text}</span>
       </div>
     ),
   },
    { title: "Số lượng", dataIndex: "quantity" },
    { title: "Giá", dataIndex: "price" },
  ];

  const selectedColumns = [
     {
          title: "Tên sản phẩm",
          dataIndex: "name",
          sorter: (a, b) => a.name.length - b.name.length,
          render: (text, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={record.images?.[0] || "https://via.placeholder.com/50"}
                alt={text}
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
              />
              <span>{text.length > 20 ? text.substring(0, 35) + "..." : text}</span>
            </div>
          ),
        },
        {
          title: "Màu sắc",
          dataIndex: "color",
          render: (_, record) => (
            <div style={{ display: "flex", gap: "10px" }}>
              {record.variants?.map((variant, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <img
                    src={variant.attributes.color.desc}
                    alt={variant.attributes.color.name}
                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }}
                  />
                  <p>{variant.attributes.color.name}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: "Kích thước",
          dataIndex: "size",
          render: (_, record) => (
            <div style={{ display: "flex", gap: "10px" }}>
              {record.variants?.map((variant, index) => (
                <span key={index}>{variant.attributes.size.name}</span>
              ))}
            </div>
          ),
        },


    {
      title: "Nhập số lượng",
      dataIndex: "quantity",
      render: (_, record) => (
        <Input
          type="number"
          min={1}
          // value={record.quantity }
           defaultValue=""
          onChange={(e) => handleInputChange(e.target.value, record, "quantity")}
        />
      ),
    },
    {
      title: "Giá nhập",
      dataIndex: "importPrice",
      render: (_, record) => (
        <Input
          type="number"
          min={0}
          // value={record.importPrice}
           defaultValue=""
          onChange={(e) => handleInputChange(e.target.value, record, "importPrice")}
        />
      ),
    },
    {
     title: "Action",
     dataIndex: "action",
     render: (_, record) => (
       <>
         <Button
           type="text"
           className="fs-3 text-danger bg-transparent border-0"
           icon={<FaCheck  style={{ color: "#00ff48", fontSize: "26px" }}/>}
           onClick={() => console.log("Saved", record)}
           style={{ width: "40px", height: "40px" }}
         />
         <Button
           type="text"
           className="ms-3 fs-3 text-danger bg-transparent border-0"
           icon={<IoClose   style={{ color: "red", fontSize: "33px" }} />}
           onClick={() =>
             setSelectedProducts((prev) =>
               prev.filter((item) => item._id !== record._id)
             )
           }
           style={{ width: "40px", height: "40px" }}
         />
       </>
     ),
   }


  
   
   
  ];

  const [accessTime, setAccessTime] = useState(moment().format("HH:mm:ss DD/MM/YYYY"));

useEffect(() => {
  setAccessTime(moment().format("HH:mm:ss DD/MM/YYYY"));
}, []);

  return (
    <div>
      <div className="bg-white p-3 rounded shadow-sm mb-4">
      <div className="d-flex justify-content-between align-items-center mx-4 py-3">
        <h3 className="m-0">Nhập thêm hàng</h3>
        {accessTime && (
          <span className="text-muted fs-6 d-flex align-items-center">
            Thời gian truy cập
            <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
            <span className="ms-2 border px-2 py-1 rounded">{accessTime}</span>
          </span>
        )}
      </div>
    </div>

     <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
               Thêm mới
          </Button>
     </div>
  

      <Modal title="Chọn sản phẩm" open={open} onCancel={hideModal} onOk={hideModal} width={700}>
      <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 10 }}
          prefix={<SearchOutlined style={{ color: "#aaa" }} />}
     />
        <Table columns={productColumns} dataSource={filteredProducts} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Modal>

      <Table
        columns={selectedColumns}
        dataSource={selectedProducts}
        rowKey="_id"
        pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} danh mục nhập hàng`,
        }}
      />
    </div>
  );
};

export default AddWareHouse;
