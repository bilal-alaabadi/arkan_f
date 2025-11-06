// src/redux/features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const initialState = loadState() || {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  shippingFee: 2,
  country: 'عمان',
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    console.error("Failed to save cart state:", err);
  }
};

export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

export const setTotalPrice = (state) =>
  state.products.reduce(
    (total, product) => total + (product.quantity * product.price),
    0
  );

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload || {};
      const stock = Number(payload.stock) || 0;
      if (stock <= 0) {
        // لا تضف شيئًا إن لم يكن هناك مخزون
        return;
      }

      const existingProduct = state.products.find(
        (product) => product._id === payload._id
      );

      const quantityToAdd = Math.max(1, Number(payload.quantity ?? 1));
      if (existingProduct) {
        const newQty = Math.min(stock, existingProduct.quantity + quantityToAdd);
        existingProduct.quantity = newQty;
        // تأكد أن الحقول الأساسية محدثة (السعر/الصور..الخ)
        existingProduct.price = payload.price ?? existingProduct.price;
        existingProduct.stock = stock;
        existingProduct.image = payload.image ?? existingProduct.image;
        existingProduct.name = payload.name ?? existingProduct.name;
      } else {
        state.products.push({
          ...payload,
          quantity: Math.min(stock, quantityToAdd),
          stock, // احفظ المخزون مع المنتج داخل السلة للمقارنة
        });
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    updateQuantity: (state, action) => {
      const { id, type } = action.payload || {};
      const product = state.products.find(p => p._id === id);
      if (product) {
        const stock = Number(product.stock) || 0;
        if (type === 'increment') {
          product.quantity = Math.min(stock, product.quantity + 1);
        } else if (type === 'decrement') {
          product.quantity = Math.max(1, product.quantity - 1);
        }
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      );
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      saveState(state);
    },

    setCountry: (state, action) => {
      state.country = action.payload;
      state.shippingFee = action.payload === 'الإمارات' ? 4 : 2;
      saveState(state);
    },

    loadCart: (state, action) => {
      return action.payload;
    }
  },
});

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setCountry,
  loadCart
} = cartSlice.actions;

export default cartSlice.reducer;
