import React, { useState } from "react";
import { Button, Upload, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { fileAI } from "../features/product/productSlice";

const Enquiries = () => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleFileUpload = async () => {
    if (!selectedFile || !title) {
      message.warning("Vui lòng chọn file PDF và nhập tiêu đề.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);

    try {
      const res = await dispatch(fileAI(formData));
      if (res.payload?.data?.message) {
        message.success("Tải lên thành công!");
        setSelectedFile(null);
        setTitle("");
      } else {
        message.error("Tải lên thất bại.");
      }
    } catch (err) {
      message.error("Đã xảy ra lỗi khi tải lên.");
    }
  };

  return (
    <div>
      <h3 className="mb-4 title" style={{color: "#fff"}}>Tải lên tài liệu AI</h3>
      <div className="mb-4 d-flex align-items-center gap-2">
        <Input
          placeholder="Nhập tiêu đề tài liệu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "250px" }}
        />
        <Upload
          beforeUpload={(file) => {
            setSelectedFile(file);
            return false; // Ngăn auto upload
          }}
          maxCount={1}
          accept=".pdf"
        >
          <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
        </Upload>
        <Button type="primary" onClick={handleFileUpload}>
          Tải lên
        </Button>
      </div>
    </div>
  );
};

export default Enquiries;
