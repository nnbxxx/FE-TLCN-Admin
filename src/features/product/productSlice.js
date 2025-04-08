import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import productService from "./productService";

export const getProducts = createAsyncThunk(
  "product/get-products",
  async (thunkAPI) => {
    const re = await productService.getProducts();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getAProduct = createAsyncThunk(
  "blog/get-product",
  async (id, thunkAPI) => {
    const re = await productService.getProduct(id);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const createProducts = createAsyncThunk(
  "product/create-products",
  async (productData, thunkAPI) => {
    const re = await productService.createProduct(productData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const deleteAProduct = createAsyncThunk(
  "product/delete-product",
  async (id, thunkAPI) => {
    const re = await productService.deleteproduct(id);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const updateAProduct = createAsyncThunk(
  "product/update-product",
  async (brand, thunkAPI) => {
    const re = await productService.updateProduct(brand);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const resetState = createAction("Reset_all");

const initialState = {
  products: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.products = action.payload.data.result;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdProduct = action.payload;
      })
      .addCase(createProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getAProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.productName = action.payload.data.name;
        state.productDesc = action.payload.data.description;
        state.productPrice = action.payload.data.price;
        state.productBrand = action.payload.data.brand;
        state.productCategory = action.payload.data.category;
        state.productTag = action.payload.data.tags;
        state.productColors = action.payload.data.colors;
        // console.log(
        //   "🚀 ~ .addCase ~ action.payload.data.colors:",
        //   action.payload.data
        // );
        state.productQuantity = action.payload.data.quantity;
        state.productImages = action.payload.data.images;
        state.productFeatures = action.payload.data.features;
        state.productVariants = action.payload.data.variants;
      })
      .addCase(getAProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteAProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedProduct = action.payload;
      })
      .addCase(deleteAProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(updateAProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedProduct = action.payload;
      })
      .addCase(updateAProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(resetState, () => initialState);
  },
});
export default productSlice.reducer;
