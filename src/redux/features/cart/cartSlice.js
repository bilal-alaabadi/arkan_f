import { createSlice } from "@reduxjs/toolkit";

// استعادة الحالة من localStorage إن وجدت
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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
addToCart: (state, action) => {
  const existingProduct = state.products.find(
    (product) => product._id === action.payload._id
  );

  const quantityToAdd = action.payload.quantity ?? 1;

  if (existingProduct) {
    existingProduct.quantity += quantityToAdd; // ✅ أضف الكمية المختارة
  } else {
    state.products.push({
      ...action.payload,
      quantity: quantityToAdd,
    });
  }

  state.selectedItems = setSelectedItems(state);
  state.totalPrice = setTotalPrice(state);
  saveState(state);
},

    updateQuantity: (state, action) => {
      const product = state.products.find(p => p._id === action.payload.id);
      if (product) {
        if (action.payload.type === 'increment') {
          product.quantity += 1;
        } else if (action.payload.type === 'decrement' && product.quantity > 1) {
          product.quantity -= 1;
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
    // إضافة رديف لتحميل الحالة من السيرفر إذا لزم الأمر
    loadCart: (state, action) => {
      return action.payload;
    }
  },
});

// دالة مساعدة لحفظ الحالة في localStorage
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

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setCountry,
  loadCart
} = cartSlice.actions;

export default cartSlice.reducer;