import React, { useEffect, useState } from "react";
import { Input, Select, Table, Button, message, Modal } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getProducts } from "../features/product/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { delImg } from "../features/upload/uploadSlice";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { FaSyncAlt } from "react-icons/fa";
import pCategoryService from "../features/pcategory/pcategoryService"; // Đường dẫn đúng đến API categories
import { getInventoryProducts } from "../features/warehouse/warehouseSlice";

const { Search } = Input;
const { Option } = Select;

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [pageSize, setPageSize] = useState(10); // Mặc định hiển thị 10 sản phẩm
  const [categoriess, setCategoriess] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getInventoryProducts());
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await pCategoryService.getProductCategories();
            console.log("Danh sách danh mục:", response.data.result);
            setCategoriess(response.data.result); // Đúng định dạng
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        }
    };

    dispatch(getProducts());
    fetchCategories();
}, [dispatch]);

  

  const inventoryProducts = useSelector(state => state.warehouse?.warehouses || []);
  const productState = useSelector((state) => state?.product?.products);

  // Xử lý chọn checkbox
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Hiển thị Modal xác nhận xóa
  const showModal = (id) => {
    setDeleteMultiple(false);
    setProductId(id);
    setOpen(true);
  };

  // Hiển thị modal xóa nhiều sản phẩm
  const confirmDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để xóa!");
      return;
    }
    setDeleteMultiple(true);
    setOpen(true);
  };

  // Xử lý xóa sản phẩm
  const deleteProduct = () => {
    if (deleteMultiple) {
      selectedRowKeys.forEach((id) => {
        dispatch(deleteAProduct(id));
        dispatch(delImg(id));
      });
      setSelectedRowKeys([]);
      message.success("Đã xóa các sản phẩm đã chọn!");
    } else {
      dispatch(deleteAProduct(productId));
      dispatch(delImg(productId));
      message.success("Đã xóa sản phẩm thành công!");
    }
    setOpen(false);
    setTimeout(() => {
      dispatch(getProducts());
    }, 300);
  };

  // Lấy danh sách danh mục (không trùng lặp)
  const categories = [...new Set(productState?.map((product) => product.category))];

  // Lọc sản phẩm theo danh mục hoặc tìm kiếm
  const filteredProducts = productState?.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = Object.values(product)
      .some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Cấu hình cột bảng
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={record.images?.[0] || "https://via.placeholder.com/50"}
            alt={text}
            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
          />
          <span>{text.length > 20 ? text.substring(0, 20) + "..." : text}</span>
        </div>
      ),
    },
    
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.length - b.brand.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (categoryId) => {
        // Kiểm tra categoriess trước khi tìm kiếm
        if (!categoriess || categoriess.length === 0) return "Đang tải...";

        const category = categoriess.find(item => item._id === categoryId);
        return category ? category.name : "Không xác định";
      },
    },
    
    {
      title: 'Quantity',
      dataIndex: 'inventory',
      key: 'quantity',
      render: (inventory) => {
        if (!inventory || !inventory.productVariants) return 0;
        const total = inventory.productVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
        return total;
      }
    },
    {
      title: 'Price',
      dataIndex: 'inventory',
      key: 'price',
      render: (inventory) => {
        if (!inventory || !inventory.productVariants || inventory.productVariants.length === 0) return 'N/A';
        const prices = inventory.productVariants.map(v => v.sellPrice).filter(p => typeof p === 'number');
        if (prices.length === 0) return 'N/A';
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? `${min.toLocaleString()} đ` : `${min.toLocaleString()} - ${max.toLocaleString()} đ`;
      }
    },    
    
    {
      title: "Action",
      dataIndex: "action",
      render: (_, item) => (
        <>
          <Link to={`/admin/product/${item._id}`} className="fs-3 text-success">
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(item._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    },
  ];

const products = useSelector((state) => state?.product?.products || []);
const latestProduct = products.length > 0 
    ? products.reduce((latest, product) => 
        new Date(product.createdAt) > new Date(latest.createdAt) ? product : latest
      )
    : null;

  
  return (
    <div>
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mx-4 py-3">
          <h3 className="m-0">Danh sách sản phẩm</h3>
          {latestProduct && (
            <span className="text-muted fs-6 d-flex align-items-center">
              Dữ liệu mới nhất
              <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
              <span className="ms-2 border px-2 py-1 rounded">
                {moment(latestProduct.createdAt).format("HH:mm:ss DD/MM/YYYY")}
              </span>
            </span>
          )}
        </div>
      </div>



      {/* Nút thêm mới sản phẩm */}
      <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/product")}>
          Thêm mới
        </Button>
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
            placeholder="Lọc theo danh mục"
            allowClear
            style={{ width: "170px" }}
            onChange={(value) => setSelectedCategory(value)}
          >
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
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

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: 16 }}>
      <span>Chức năng:</span>

      {selectedRowKeys.length > 0 && (
        <Button style={{ color: "red" }} type="danger" icon={<DeleteOutlined />} onClick={confirmDeleteSelected}>
        <span style={{ color: "red" }}>Xóa đã chọn ({selectedRowKeys.length})</span>
        </Button>
      )}
    </div>


      {/* Bảng danh sách sản phẩm */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredProducts || []}
        rowKey={(record) => record._id || record.key}
        pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} sản phẩm`,
        }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedProduct(record);
            setDetailModalOpen(true);
          },
        })}
      />

      
     {/* Panel hiển thị chi tiết sản phẩm */}
     {selectedProduct && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Nền mờ
          display: "flex",
          justifyContent: "flex-end", // Đẩy panel về bên phải
          zIndex: 1000,
        }}
        onClick={() => setSelectedProduct(null)} // Click ra ngoài để đóng
      >
        <div
          style={{
            width: "600px",
            padding: "28px",
            background: "#fff",
            boxShadow: "-2px 0px 5px rgba(0,0,0,0.1)",
            borderLeft: "1px solid #ddd",
            position: "relative",
            height: "100vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài
        >
           <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Thông tin chi tiết sản phẩm</h3>
              <Link to={`/admin/product/${selectedProduct._id}`} className="fs-3 text-success">
                <BiEdit size={24} />
              </Link>
            </div>
          <p><strong>ID:</strong> {selectedProduct._id}</p>
          <p><strong>Tên sản phẩm:</strong> {selectedProduct.name}</p>
          <p><strong>Thương hiệu:</strong> {selectedProduct.brand}</p>
          <p><strong>Danh mục:</strong>{" "}
            {categoriess && categoriess.length > 0 ? 
              categoriess.find(cat => cat._id === selectedProduct.category)?.name || "Không xác định" 
              : "Đang tải..."}
          </p>
          {/* <p><strong>Số lượng trong kho:</strong> {selectedProduct.quantity}</p>
          <p><strong>Giá bán:</strong> {selectedProduct.price.toLocaleString()} VND</p> */}
          <p><strong>Mô tả sản phẩm:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: selectedProduct.description || "Chưa có mô tả." }} />


          {selectedProduct.images?.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              {selectedProduct.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  style={{
                    height: "180px",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          )}
          {selectedProduct?.inventory?.productVariants &&
            Array.isArray(selectedProduct.inventory.productVariants) &&
            selectedProduct.inventory.productVariants.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Biến thể sản phẩm</h4>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      {selectedProduct.inventory.productVariants.some(
                        (v) => v.attributes?.color || v.attributes?.size
                      ) && (
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                          Biến thể
                        </th>
                      )}
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Số lượng</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Giá bán</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Giảm giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.inventory.productVariants.map((variant, index) => {
                      const hasAttributes =
                        variant.attributes?.color || variant.attributes?.size;

                      return (
                        <tr key={index}>
                          {selectedProduct.inventory.productVariants.some(
                            (v) => v.attributes?.color || v.attributes?.size
                          ) && (
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {variant.attributes?.color && (
                                <div
                                  title={variant.attributes.color}
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    backgroundColor: variant.attributes.color,
                                    border: "1px solid #ccc",
                                    borderRadius: "50%", // Hình tròn
                                  }}
                                />
                              )}
                              {variant.attributes?.size && <span>{variant.attributes.size}</span>}
                            </div>
                          </td>
                          )}
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {variant.stock ?? 0}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {(variant.sellPrice ?? 0).toLocaleString()} đ
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {variant.discount ?? 0}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
          )}



        </div>
      </div>
    )}


      {/* Modal xác nhận xóa */}
      <Modal
        title={deleteMultiple ? "Bạn có chắc muốn xóa các sản phẩm đã chọn?" : "Bạn có chắc muốn xóa sản phẩm này?"}
        visible={open}
        onOk={deleteProduct}
        onCancel={() => setOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      />

      
    </div>
  );
};

export default Productlist;
