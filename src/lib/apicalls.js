import axios from "axios";


const API_BASE = "http://localhost:3000/api/products"; // Change in production if needed

// Create Product (POST)
export const createProduct = async (formData) => {
  try {
    const res = await axios.post(API_BASE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create Product Error:", error);
  
    throw new Error("Failed to create product");
  }
};

// Get All Products with Filters and Pagination (GET)
export const getProducts = async ({
  status,
  start,
  end,
  limit = 10,
  skip = 0,
} = {}) => {
  try {
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    params.append("limit", limit.toString());
    params.append("skip", skip.toString());

    const res = await axios.get(`${API_BASE}?${params.toString()}`);

    return Array.isArray(res.data.products) ? res.data.products : [];
  } catch (error) {
  
    console.error("Get Products Error:", error);
    return [];
  }
};

// Get Single Product by ID (GET)
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Get Product by ID (${id}) Error:`, error);
  
    throw new Error("Failed to fetch product");
  }
};

// Update Product by ID (PUT)
export const updateProduct = async (id, formData) => {
  try {
    const res = await axios.put(`${API_BASE}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    
    console.error(`Update Product (${id}) Error:`, error);
    throw new Error("Failed to update product");
  }
};

// Delete Product by ID (DELETE)
export const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
  } catch (error) {
    
    console.error(`Delete Product (${id}) Error:`, error);
    throw new Error("Failed to delete product");
  }
};
