import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import warehouseService from "./warehouseService";



export const inventoryProduct = createAsyncThunk(
  "warehouse/inventory-product",
  async (warehouseData, thunkAPI) => {
    const re = await warehouseService.createWarehouse(warehouseData);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getInventoryProducts = createAsyncThunk(
  "warehouse/get-inventory-product",
  async (thunkAPI) => {
    const re = await warehouseService.getInventoryProduct();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  warehouses: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const warehouseSlice = createSlice({
  name: "warehouses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
  
      .addCase(inventoryProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(inventoryProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createWarehouse = action.payload;
      })
      .addCase(inventoryProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getInventoryProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInventoryProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.warehouses = action.payload.data.result;
      })
      .addCase(getInventoryProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
    
     
      .addCase(resetState, () => initialState);
  },
});
export default warehouseSlice.reducer;
