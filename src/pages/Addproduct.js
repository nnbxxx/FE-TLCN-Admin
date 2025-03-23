import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Button, Modal, Select } from "antd";
import Dropzone from "react-dropzone";
import { LuImagePlus } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { DeleteOutlined, PlusOutlined, TagsOutlined } from "@ant-design/icons";

import {
  delImg,
  uploadImg,
  resetState as resetStateUpload,
} from "../features/upload/uploadSlice";
import {
  createProducts,
  getAProduct,
  resetState,
  updateAProduct,
} from "../features/product/productSlice";
let schema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
  price: yup
    .number()
    .typeError("Giá phải là một số") // Kiểm tra giá trị phải là số
    .moreThan(0, "Giá phải lớn hơn 0") // Kiểm tra giá trị phải lớn hơn 0
    .required("Giá không được để trống"),
  brand: yup.string().required("Thương hiệu không được để trống"),
  category: yup.string().required("Danh mục không được để trống"),
  tags: yup.string().required("Thẻ không được để trống"),
  color: yup
    .array()
    .min(1, "Chọn ít nhất một màu")
    .required("Màu sắc không được để trống"),
  quantity: yup
    .number()
    .typeError("Số lượng phải là một số") // Kiểm tra giá trị phải là số
    .moreThan(0, "Số lượng phải lớn hơn 0") // Kiểm tra giá trị phải lớn hơn 0
    .required("Số lượng không được để trống"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, []);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state?.upload?.images);
  const newProduct = useSelector((state) => state.product);
  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updatedProduct,
    productName,
    productDesc,
    productPrice,
    productBrand,
    productCategory,
    productTag,
    productColors,
    productQuantity,
    productImages,
  } = newProduct;

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [getProductId]);
  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfullly!");
      navigate("/admin/list-product");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const coloropt = [];
  colorState.forEach((i) => {
    coloropt.push({
      label: (
        <div className="col-3">
          <ul
            className="colors ps-0"
            style={{
              width: "20px",
              height: "20px",
              marginBottom: "10px",
              backgroundColor: i.color,
              borderRadius: "50%", // Added inline style for rounded shape
              listStyle: "none", // Hide bullet points
              border: "2px solid transparent",
            }}
          ></ul>
        </div>
      ),
      value: i._id,
    });
  });

  const productcolor = [];
  productColors?.forEach((i) => {
    productcolor.push({
      label: (
        <div className="col-3">
          <ul
            className="colors ps-0"
            style={{
              width: "20px",
              height: "20px",
              marginBottom: "10px",
              backgroundColor: i.color,
              borderRadius: "50%", // Added inline style for rounded shape
              listStyle: "none", // Hide bullet points
              border: "2px solid transparent",
            }}
          ></ul>
        </div>
      ),
      value: i._id,
    });
  });

  useEffect(() => {
    formik.values.color = color ? color : " ";
  }, [color]);
  const formik = useFormik({
    initialValues: {
      title: productName || "",
      description: productDesc || "",
      price: productPrice || "",
      brand: productBrand || "",
      category: productCategory || "",
      tags: productTag || "",
      color: productColors || "",
      quantity: productQuantity || "",
      images: productImages || [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
      if (getProductId !== undefined) {
        const data = { id: getProductId, productData: values };
        dispatch(
          updateAProduct({
            _id: getProductId,
            name: values.title,
            category: values.category,
            brand: values.brand,
            price: +values.price,
            tags: values.tags,
            description: values.description,
            images: values.images,
            colors: values.color,
            quantity: values.quantity,
          })
        );
        navigate("/admin/list-product");
      } else {
        dispatch(
          createProducts({
            name: values.title,
            category: values.category,
            brand: values.brand,
            price: +values.price,
            tags: values.tags,
            description: values.description,
            images: values.images,
            colors: values.color,
            quantity: values.quantity,
          })
        );
        formik.resetForm();
        setColor(null);
        setTimeout(() => {
          dispatch(resetState());
          dispatch(resetStateUpload());
        }, 3000);
      }
    },
  });
  const handleDeleteImage = (index) => {
    const updatedImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue("images", updatedImages);
  };
  const handleColors = (e) => {
    setColor(e);
    console.log(color);
  };
  useEffect(() => {
    let tmp = formik.values.images;
    formik.setFieldValue("images", [...tmp, ...imgState]);
  }, [imgState]);



  //thêm mới
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);

  const imagesByName = {};

  const handleAddAttribute = () => {
    setAttributes([...attributes, { id: Date.now(), name: "", values: "" }]);
  };

  const handleRemoveAttribute = (id) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));
    generateVariants(attributes.filter((attr) => attr.id !== id));
  };

  // const handleAttributeChange = (id, field, value) => {
  //   const updatedAttributes = attributes.map((attr) =>
  //     attr.id === id ? { ...attr, [field]: value } : attr
  //   );
  //   setAttributes(updatedAttributes);
  //   generateVariants(updatedAttributes);
  // };

  const handleAttributeChange = (id, field, value) => {
    const updatedAttributes = attributes.map((attr) =>
      attr.id === id ? { ...attr, [field]: value } : attr
    );
    
    setAttributes(updatedAttributes);
  
    // Nếu thuộc tính là màu sắc, tự động gán danh sách màu
    if (field === "name" && value === "Màu sắc") {
      const colorValues = colorState.map((c) => c.color).join("\n"); // Lấy danh sách màu
      setAttributes((prev) =>
        prev.map((attr) =>
          attr.id === id ? { ...attr, values: colorValues } : attr
        )
      );
    } else {
      generateVariants(updatedAttributes);
    }
  };
  

  const generateVariants = (attrs) => {
    const attrValues = attrs.map((attr) => attr.values.split("\n").map(val => val.trim()).filter(val => val));
    const combinations = attrValues.reduce(
      (acc, values) => acc.flatMap((item) => values.map((val) => `${item}-${val}`)),
      [""]
    );

    setVariants(
      combinations.filter((item) => item !== "").map((variant, index) => ({ id: index + 1, name: variant, cost: 0, price: 0, stock: 0 }))
    );
  };

  // const availableAttributes = [
  //   "Màu sắc",
  //   "Kích thước",
  //   "Chất liệu",
 
  // ];
  const selectedAttributes = attributes.map((attr) => attr.name);
  


  //--------------------------------
  const [availableAttributes, setAvailableAttributes] = useState([
    "Màu sắc",
    "Kích thước",
    "Chất liệu",
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");

  const handleSelectChange = (id, value) => {
    console.log("Giá trị chọn:", value);
    handleAttributeChange(id, "name", value);
  };

  const handleOk = () => {
    if (newAttributeName.trim()) {
      setAvailableAttributes([...availableAttributes, newAttributeName]); // Thêm thuộc tính mới
      setNewAttributeName("");
      setIsModalVisible(false);
    } else {
      alert("Vui lòng nhập tên thuộc tính!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const colorGroups = {};
  variants.forEach((variant) => {
    const colorMatch = variant.name.match(/(-#[0-9a-fA-F]{6})/);
    const color = colorMatch ? colorMatch[0] : variant.name; // Lấy phần màu sắc (VD: "-#265e2a")
    if (!colorGroups[color]) {
      colorGroups[color] = [];
    }
    colorGroups[color].push(variant);
  });

  const handleUploadImage = (acceptedFiles, color) => {
    if (acceptedFiles.length === 0) return;
  
    const newImage = URL.createObjectURL(acceptedFiles[0]);
  
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.name.includes(color) ? { ...variant, image: newImage } : variant
      )
    );
  };
  
  
  const handleDeleteI = (color) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.name.includes(color) ? { ...variant, image: null } : variant
      )
    );
  };
  

  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId !== undefined ? "Sửa" : "Thêm"} sản phẩm
      </h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Nhập tiêu đề sản phẩm"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Nhập giá sản phẩm"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Chọn thương hiệu</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.brand}>
                  {i.brand}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Chọn danh mục sản phẩm</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.name}>
                  {i.name}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Chọn danh mục
            </option>
            <option value="featured">Nổi bật</option>
            <option value="popular">Phổ biến</option>
            <option value="special">Đặc biệt</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>

          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Chọn màu sắc"
            defaultValue={productcolor || color}
            onChange={(i) => handleColors(i)}
            options={coloropt}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type="number"
            label="Nhập số lượng sản phẩm"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>


          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
            <Dropzone onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "border-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                >
                  {/* Icon ảnh + Chữ */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <LuImagePlus size={24} color="#3b82f6" />
                    <p style={{ color: "#4B5563", fontSize: "14px", margin: "0" }}>
                      Upload or drop a file right here
                    </p>
                  </div>

                  {/* Định dạng file */}
                  <p style={{ color: "#9CA3AF", fontSize: "14px", margin: "0" }}>
                    JPEG, PNG, GIF...
                  </p>

                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
            {formik.values.images?.map((image, index) => (
              <div
                className="position-relative shadow-sm rounded border"
                key={index}
                style={{
                  width: "160px", // Đặt chiều rộng cố định
                  aspectRatio: "2 / 3", // Giữ tỷ lệ 2:3
                  overflow: "hidden",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                {/* Nút xóa */}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="btn-close position-absolute bg-white rounded-circle p-1"
                  style={{
                    top: "6px",
                    right: "6px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                ></button>

                {/* Hình ảnh giữ nguyên tỷ lệ */}
                <img
                  src={image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", // Hiển thị đầy đủ ảnh mà không bị cắt
                    borderRadius: "10px",
                    backgroundColor: "#f8f8f8", // Màu nền nhẹ nếu ảnh không phủ hết
                  }}
                />
              </div>
            ))}
          </div>

          <div className="p-4 border rounded shadow bg-white">
          <h5 className="fw-semibold fs-5 mb-3">Thuộc tính sản phẩm</h5>
                  <button className="btn btn-outline-primary mb-3" onClick={() => setIsModalVisible(true)}>
                    ➕ Tạo thuộc tính mới
                  </button>
              {attributes.map((attribute) => (
                <div key={attribute.id} className="d-flex align-items-center gap-3 mb-2 border p-3 rounded bg-light">
                  <select
                    className="form-select w-25"
                    value={attribute.name}
                    onChange={(e) => handleAttributeChange(attribute.id, "name", e.target.value)}
                  >
                    <option value="">Chọn thuộc tính</option>
                    {availableAttributes.map((attr) => (
                      <option key={attr} value={attr} disabled={selectedAttributes.includes(attr) && attr !== attribute.name}>
                          {attr}
                        </option>
                        
                    ))}

                  </select>
                

                   {/* Popup Modal */}
                   <Modal
                      title="Thêm thuộc tính mới"
                      open={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={[
                        <Button key="back" onClick={handleCancel}>
                          Hủy
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                          Lưu
                        </Button>,
                      ]}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên thuộc tính (VD: Chất liệu, Màu sắc, Kích thước)"
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                      />
                    </Modal>

                    {attribute.name === "Màu sắc" ? (
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Chọn màu sắc"
                      defaultValue={[]}
                      onChange={(selectedColors) =>
                        handleAttributeChange(attribute.id, "values", selectedColors.join("\n"))
                      }
                    >
                      {colorState.map((color) => (
                        <Select.Option key={color._id} value={color.color}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: color.color,
                                display: "inline-block",
                                borderRadius: "50%",
                                border: "1px solid #ccc",
                              }}
                            ></span>
                            {color.color}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <textarea
                      className="form-control form-control-sm flex-grow-1"
                      rows="2"
                      style={{ height: "37px" }}
                      placeholder="Nhập từng giá trị và enter"
                      value={attribute.values.split("\n").join(", ")} // Hiển thị nằm ngang
                      onChange={(e) => handleAttributeChange(attribute.id, "values", e.target.value.replace(/, /g, "\n"))}
                    />
                  )}

                  <button onClick={() => handleRemoveAttribute(attribute.id)} className="btn btn-outline-danger">
                    <DeleteOutlined size={22} />
                  </button>
                </div>
              ))}
              <button onClick={handleAddAttribute} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                <PlusOutlined />
                Thêm thuộc tính
              </button>


              <h2 className="fw-semibold fs-5 mt-4 mb-3">Danh sách hàng hóa cùng loại</h2>
              <table className="table table-bordered text-start">
                  <thead>
                    <tr className="table-light">
                      <th className="p-2">Tên</th>
                      <th className="p-2">Giá vốn</th>
                      <th className="p-2">Giá bán</th>
                      <th className="p-2">Tồn kho</th>
                      <th className="p-2">Ảnh</th>
                      <th className="p-2 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(colorGroups).map(([color, items]) => {
                      return items.map((variant, index) => (
                        <tr key={variant.id}>
                          <td className="p-2">{variant.name}</td>
                          <td className="p-2">
                            <input
                              type="number"
                              className="form-control"
                              value={variant.cost}
                              onChange={(e) =>
                                setVariants(
                                  variants.map((v) =>
                                    v.id === variant.id ? { ...v, cost: e.target.value } : v
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              className="form-control"
                              value={variant.price}
                              onChange={(e) =>
                                setVariants(
                                  variants.map((v) =>
                                    v.id === variant.id ? { ...v, price: e.target.value } : v
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              className="form-control"
                              value={variant.stock}
                              onChange={(e) =>
                                setVariants(
                                  variants.map((v) =>
                                    v.id === variant.id ? { ...v, stock: e.target.value } : v
                                  )
                                )
                              }
                            />
                          </td>

                          {/* Chỉ hiển thị ô upload ảnh ở dòng đầu tiên của mỗi nhóm màu */}
                          {index === 0 && (
                            <td className="p-22 text-center" rowSpan={items.length}>
                              <Dropzone onDrop={(acceptedFiles) => handleUploadImage(acceptedFiles, color)}>
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    {...getRootProps()}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "100%",
                                      padding: "7px",
                                      border: "2px dashed #ccc",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                      transition: "border-color 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                                  >
                                    <input {...getInputProps()} />
                                    {variant.image ? (
                                      <div
                                        style={{
                                          position: "relative",
                                          width: "80px",
                                          height: "80px",
                                          overflow: "hidden",
                                          borderRadius: "10px",
                                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        }}
                                      >
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
                                            handleDeleteI(color);
                                          }}
                                          className="btn-close position-absolute bg-white rounded-circle p-1"
                                          style={{
                                            top: "6px",
                                            right: "6px",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                          }}
                                        ></button>
                                        <img
                                          src={variant.image}
                                          alt="Uploaded"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            backgroundColor: "#f8f8f8",
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <p style={{ color: "#4B5563", fontSize: "14px", margin: "0" }}>
                                        Upload Image
                                      </p>
                                    )}
                                  </div>
                                )}
                              </Dropzone>
                            </td>
                          )}

                          <td className="p-2 text-center">
                            <button
                              onClick={() => setVariants(variants.filter((v) => v.id !== variant.id))}
                              className="btn btn-outline-danger"
                            >
                              <DeleteOutlined size={18} />
                            </button>
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>

              <p className="mt-2 text-muted small text-end fs-6">Danh sách bao gồm {variants.length} hàng hóa cùng loại</p>
            </div>


          
          <div className="text-center">
            <button className="btn btn-success btn-lg mx-3" type="submit">
              {getProductId !== undefined ? (
                <>
                  <i className="fas fa-edit me-1"></i> Edit
                </>
              ) : (
                "Thêm"
              )}{" "}
              Sản phẩm
            </button>
            <Link
              to="/admin/list-product"
              className="btn btn-danger btn-lg mx-3"
            >
              <i className="fas fa-times me-1"></i> Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
