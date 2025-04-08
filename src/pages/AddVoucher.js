import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Modal, Checkbox, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddVoucher = () => {
  const [productIds, setProductIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  // Mock product data
  const mockProducts = [
    { id: "1", name: "Sản phẩm A" },
    { id: "2", name: "Sản phẩm B" },
    { id: "3", name: "Sản phẩm C" },
  ];

  const postApi = async (values) => {
    if (values.applies_to === "specific") {
      values.productIds = productIds;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setToastMessage("Mã giảm giá đã được tạo");
      notification.success({
        message: "Thành công",
        description: "Mã giảm giá đã được tạo thành công!",
      });
      navigate("/seller/discounts");
      setIsLoading(false);
    }, 1000); // Simulate a delay
  };

  const handleSubmit = (values) => {
    postApi({ ...values, is_active: isSaveDraft ? 1 : 2 });
  };

  // Handle select products
  const handleProductSelect = (product) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = [...prevSelected];
      if (newSelected.includes(product.id)) {
        return newSelected.filter((id) => id !== product.id);
      } else {
        newSelected.push(product.id);
      }
      return newSelected;
    });
  };

  // Toggle product modal visibility
  const toggleProductModal = () => {
    setIsProductModalOpen(!isProductModalOpen);
  };

  return (
    <div className="mt-5">
      {isLoading && <div className="loader">Loading...</div>}

      <Form onFinish={handleSubmit} layout="vertical">
        <div className="flex items-center justify-between">
          <Link to="/seller/discounts" className="text-gray-600 hover:underline flex items-center">
            ← Quay lại
          </Link>
          <div className="flex gap-3">
            <Button type="default" onClick={() => setIsSaveDraft(true)} loading={isLoading}>Lưu bản nháp</Button>
            <Button type="primary" htmlType="submit" onClick={() => setIsSaveDraft(false)} loading={isLoading}>Tạo mã giảm giá</Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-12 gap-5">
          <div className="col-span-9 grid gap-5">
            <div className="bg-white shadow-md rounded-lg p-5">
              <h3 className="text-xl font-bold">Tổng quan</h3>
              <Form.Item label="Tiêu đề giảm giá" name="name" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề giảm giá!' }]}>
                <Input placeholder="Nhập tiêu đề" />
              </Form.Item>

              <Form.Item label="Mã giảm giá" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]}>
                <Input maxLength={10} />
              </Form.Item>
            </div>

            <div className="bg-white p-5 shadow-md rounded-lg">
              <h3 className="text-xl font-bold">Áp dụng cho</h3>
              <Form.Item label="Áp dụng cho" name="applies_to">
                <Select defaultValue="all">
                  <Option value="all">Tất cả sản phẩm</Option>
                  <Option value="specific">Sản phẩm nhất định</Option>
                </Select>
              </Form.Item>
              {isSaveDraft && (
                <div className="mt-4">
                  <Input placeholder="Tìm kiếm sản phẩm" readOnly />
                  <Button type="default" onClick={toggleProductModal} className="mt-2">Chọn sản phẩm</Button>
                </div>
              )}
            </div>

            <div className="bg-white p-5 shadow-md rounded-lg">
              <h3 className="text-xl font-bold">Ngày & Giờ</h3>
              <div className="grid grid-cols-2 gap-5">
                <Form.Item label="Thời gian bắt đầu" name="start_date" rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Thời gian kết thúc" name="end_date" rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="col-span-3 bg-white p-5 shadow-md rounded-lg">
            <h3 className="text-xl font-bold">Tóm tắt</h3>
            <p className="text-gray-600">Mã giảm giá sẽ áp dụng cho các sản phẩm bạn đã chọn.</p>
          </div>
        </div>
      </Form>

      {/* Modal chọn sản phẩm */}
      <Modal
        title="Chọn sản phẩm"
        visible={isProductModalOpen}
        onCancel={toggleProductModal}
        footer={[
          <Button key="close" onClick={toggleProductModal}>Đóng</Button>,
        ]}
      >
        <div>
          {mockProducts.map((product) => (
            <div key={product.id} className="flex items-center mb-3">
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleProductSelect(product)}
              />
              <span className="ml-2">{product.name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AddVoucher;
