import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Table, Modal, Checkbox, notification } from "antd";
import { AiFillDelete, AiFillSave } from "react-icons/ai";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import moment from "moment";
import { FaCheck, FaSyncAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { inventoryProduct, getInventoryProducts } from "../features/warehouse/warehouseSlice";

const AddWareHouse = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const warehouses = useSelector(state => state.warehouse?.warehouses);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getInventoryProducts())
  }, [dispatch]);


  const showModal = () => setOpen(true);
  const hideModal = () => setOpen(false);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((item) => item._id === product._id);
  
      if (existingProduct) {
        // Nếu sản phẩm đã được chọn, thì bỏ chọn (xóa khỏi danh sách)
        return prev.filter((item) => item._id !== product._id);
      } else {
        // Nếu chưa chọn, thêm mới vào danh sách
        return [...prev, { ...product, quantity: 1, importPrice: product.price }];
      }
    });
  };
  
  const selectedProductsWithWarehouseData = useMemo(() => {
    return selectedProducts.map(product => {
      const warehouseEntry = warehouses.find(w => w.productId === product._id);
      return {
        ...product,
        totalQuantity: warehouseEntry?.totalQuantity ?? 0,
        exportPrice: warehouseEntry?.exportPrice ?? 0,
        discount: warehouseEntry?.discount ?? 0,
      };
    });
  }, [selectedProducts, warehouses]);
  
  
  

  const handleInputChange = (value, record, field, index) => {
    let newValue = Math.max(0, Number(value)); // Không cho nhỏ hơn 0
  
    // Giới hạn discount và exportPrice không quá 100
    if (field === "discount" || field === "exportPrice") {
      newValue = Math.min(100, newValue);
    }
  
    setSelectedProducts((prev) =>
      prev.map((item) => {
        if (item._id === record._id) {
          const updatedVariants = item.variants.map((variant, idx) => {
            if (idx === index) {
              return { ...variant, [field]: newValue };
            }
            return variant;
          });
          return { ...item, variants: updatedVariants };
        }
        return item;
      })
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
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <span>{text.length > 20 ? text.substring(0, 35) + "..." : text}</span>
        </div>
      ),
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'inventory',
      key: 'inventory',
      width: 120,
      render: (inventory) => inventory?.totalQuantity ?? 0
    },
    
    {
      title: 'Giá bán',
      dataIndex: 'inventory',
      key: 'price',
      width: 150,
      render: (inventory) => {
        if (!inventory?.productVariants?.length) return '0₫';
    
        const prices = inventory.productVariants
          .map(v => v.sellPrice)
          .filter(p => typeof p === 'number');
    
        if (prices.length === 0) return '0₫';
    
        const min = Math.min(...prices);
        const max = Math.max(...prices);
    
        return min === max
          ? `${min.toLocaleString()} ₫`
          : `${min.toLocaleString()} ₫ - ${max.toLocaleString()} ₫`;
      }
    }
    
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
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <span>{text.length > 20 ? text.substring(0, 35) + "..." : text}</span>
        </div>
      ),
    },
    {
      title: "Tổng trong kho",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
      render: (text) => <span>{text}</span>,
    },   
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
      
          <Button
              type="text"
              className="fs-3 text-danger bg-transparent border-0"
              icon={<FaCheck style={{ color: "#00ff48", fontSize: "26px" }} />}
              onClick={() => handleSaveSingleProduct(record)}
              style={{ width: "40px", height: "40px" }}
            >

            </Button>


          <Button
            type="text"
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            icon={<IoClose style={{ color: "red", fontSize: "33px" }} />}
            onClick={() =>
              setSelectedProducts((prev) =>
                prev.filter((item) => item._id !== record._id)
              )
            }
            style={{ width: "40px", height: "40px" }}
          />
        </>
      ),
    },
  ];
  

  const expandedRowRender = (record) => {
    // Trường hợp sản phẩm không có biến thể
    if (!record.variants || record.variants.length === 0) {
      const noVariantColumns = [
        {
          title: "Số lượng",
          dataIndex: "quantity",
          width: 120,
          render: (_, item) => (
            <Input
              type="number"
              min={0}
              value={item.quantity ?? 0}
              addonAfter="cái"
              onChange={(e) =>
                setSelectedProducts((prev) =>
                  prev.map((p) =>
                    p._id === item._id
                      ? { ...p, quantity: Math.max(0, Number(e.target.value))}
                      : p
                  )
                )
              }
            />
          ),
        },
        {
          title: "Giá nhập",
          dataIndex: "importPrice",
          width: 150,
          render: (_, item) => (
            <Input
              type="number"
              min={0}
              value={item.importPrice ?? 0}
              addonAfter="VND"
              onChange={(e) =>
                setSelectedProducts((prev) =>
                  prev.map((p) =>
                    p._id === item._id
                      ? { ...p, importPrice: Math.max(0, Number(e.target.value)) }
                      : p
                  )
                )
              }
            />
          ),
        },
        {
          title: "Lợi nhuận (%)",
          dataIndex: "exportPrice",
          width: 150,
          render: (_, item) => (
            <Input
              type="number"
              min={0}
              value={item.exportPrice ?? 0}
              addonAfter="%"
              onChange={(e) =>
                setSelectedProducts((prev) =>
                  prev.map((p) =>
                    p._id === item._id
                      ? { ...p, exportPrice: Math.max(0, Math.min(100, Number(e.target.value))) }
                      : p
                  )
                )
              }
            />
          ),
        },
        {
          title: "Giảm giá (%)",
          dataIndex: "discount",
          width: 150,
          render: (_, item) => (
            <Input
              type="number"
              min={0}
              max={100}
              value={item.discount ?? 0}
              addonAfter="%"
              onChange={(e) =>
                setSelectedProducts((prev) =>
                  prev.map((p) =>
                    p._id === item._id
                      ? { ...p, discount:Math.max(0, Math.min(100, Number(e.target.value))) }
                      : p
                  )
                )
              }
            />
          ),
        },
      ];
      
      const matchedItem = selectedProducts.find((p) => p._id === record._id);
      
      return (
        <Table
          columns={noVariantColumns}
          dataSource={matchedItem ? [matchedItem] : []}
          pagination={false}
          rowKey="_id"
        />
      );
    }
  
    // Trường hợp có biến thể
    const variantColumns = [
      {
        title: "",
        dataIndex: "image",
        width: 80,
        render: (_, variant) => (
          <img
            src={
              variant.attributes?.color?.desc ||
              "https://via.placeholder.com/60x60?text=No+Image"
            }
            alt="variant"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ),
      },
      {
        title: "Biến thể",
        dataIndex: "variant",
        width: 150,
        render: (_, variant) =>
          `${variant.attributes?.color?.name ?? "N/A"} - ${variant.attributes?.size?.name ?? "N/A"}`,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        width: 150,
        render: (_, variant, index) => (
          <Input
            type="number"
            min={0}
            value={variant.quantity ?? 0}
            addonAfter="cái"
            onChange={(e) =>
              handleInputChange(e.target.value, record, "quantity", index)
            }
          />
        ),
      },
      {
        title: "Giá nhập",
        dataIndex: "importPrice",
        width: 150,
        render: (_, variant, index) => (
          <Input
            type="number"
            min={0}
            value={variant.importPrice ?? 0}
            addonAfter="VND"
            onChange={(e) =>
              handleInputChange(e.target.value, record, "importPrice", index)
            }
          />
        ),
      },
      {
        title: "Lợi nhuận (%)",
        dataIndex: "exportPrice",
        width: 150,
        render: (_, variant, index) => (
          <Input
            type="number"
            min={0}
            value={variant.exportPrice ?? 0}
            addonAfter="%"
            onChange={(e) =>
              handleInputChange(e.target.value, record, "exportPrice", index)
            }
          />
        ),
      },
      {
        title: "Giảm giá (%)",
        dataIndex: "discount",
        width: 150,
        render: (_, variant, index) => (
          <Input
            type="number"
            min={0}
            max={100}
            value={variant.discount ?? 0}
            addonAfter="%"
            onChange={(e) =>
              handleInputChange(e.target.value, record, "discount", index)
            }
          />
        ),
      },
    ];
  
    return (
      <Table
        columns={variantColumns}
        dataSource={record.variants}
        pagination={false}
        rowKey={(_, index) => index}
      />
    );
  };
  
  
  const [accessTime, setAccessTime] = useState(moment().format("HH:mm:ss DD/MM/YYYY"));

  useEffect(() => {
    setAccessTime(moment().format("HH:mm:ss DD/MM/YYYY"));
  }, []);

  
  const handleSaveSingleProduct = async (product) => {
    let payload;
  
    if (product.variants && product.variants.length > 0) {
      // Trường hợp có biến thể
      payload = {
        productId: product._id,
        variants: product.variants.map((variant) => ({
          color: variant?.attributes?.color?.name || "",
          size: variant?.attributes?.size?.name || "",
          quantity: Number(variant?.quantity) || 0,
          importPrice: Number(variant?.importPrice) || 0,
          exportPrice: Number(variant?.exportPrice) || 0,
          discount: Number(variant?.discount) || 0,
        })),
      };
    } else {
      // Trường hợp không có biến thể
      payload = {
        productId: product._id,
        variants: [
          {
            color: "", // hoặc product.color nếu có
            size: "",  // hoặc product.size nếu có
            quantity: Number(product?.quantity) || 0,
            importPrice: Number(product?.importPrice) || 0,
            exportPrice: Number(product?.exportPrice) || 0,
            discount: Number(product?.discount) || 0,
          },
        ],
      };
    }
  
    try {
      await dispatch(inventoryProduct(payload));
      notification.success({
        message: "Thành công",
        description: `Đã lưu sản phẩm "${product.name}" vào kho`,
      });
  
      const updated = selectedProducts.filter(p => p._id !== product._id);
      setSelectedProducts(updated);
    } catch (error) {
      notification.error({
        message: "Thất bại",
        description: `Không thể lưu sản phẩm "${product.name}"`,
      });
    }
  };
  
  const authState = useSelector((state) => state?.auth?.user);
  

  return (
    <div>
      <div className="bg-white rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mx-4 py-3">
          
              <div>
                <h3 className="m-0">Nhập thêm hàng</h3>
                <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
                  Chào {authState?.name || "bạn"}, chào mừng bạn quay trở lại trang quản trị của Sắc
                </div>
              </div>
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
        dataSource={selectedProductsWithWarehouseData}
        rowKey="_id"
        expandable={{ expandedRowRender }}
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
