import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
  total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0,
  totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart(state, action) {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);

      if (index >= 0) {
        // Course is already in cart
        toast.error("Course already in cart");
        return;
      }

      // Add to cart
      state.cart.push(course);
      state.totalItems++;
      state.total += course.price;

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      // Toast notification
      toast.success("Course added to cart");
    },
    removeFromCart(state, action) {
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);

      if (index >= 0) {
        state.total -= state.cart[index].price;
        state.totalItems--;
        state.cart.splice(index, 1);

        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        // Toast notification
        toast.success("Course removed from cart");
      }
    },
    resetCart(state) {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      // Reset localStorage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
    setTotalItems(state, value) {
      state.totalItems = value.payload;
    },
  },
});

export const { addToCart, removeFromCart, resetCart, setTotalItems } = cartSlice.actions;
export default cartSlice.reducer;
