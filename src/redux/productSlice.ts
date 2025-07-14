import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  title: string;
  description: string;
  price: number;
  image: string | null;
  status: string |any;
  addedDate: string;
  formType: "create" | "update";
    productId: string | null
}

const initialState: ProductState = {
  title: "",
  description: "",
  price: 0,
  image: "",
  status: "",
  addedDate: "",
  formType: "create",
  productId:null
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
    setAddedDate: (state, action: PayloadAction<string>) => {
      state.addedDate = action.payload;
    },
    setFormType: (state, action: PayloadAction<"create" | "update">) => {
      state.formType = action.payload;
    },
      setProductId: (state, action) => {
    state.productId = action.payload;
  },
    resetProduct: () => initialState,
  },
});

export const {
  setTitle,
  setDescription,
  setPrice,
  setImage,
  setStatus,
  setAddedDate,
  setFormType,
  resetProduct,
  setProductId
} = productSlice.actions;
export default productSlice.reducer;
