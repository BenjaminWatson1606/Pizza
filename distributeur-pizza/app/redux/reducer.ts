// reducer.ts
import { CartAction, PizzaAction, Pizza } from "./actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";

interface CartState {
  cart: Pizza[];
  totalPrice: number;
}

// Initial state for the cart
const initialCartState: CartState = {
  cart: [],
  totalPrice: 0,
};

const initialPizzaState: Pizza[] = [];

export const cartReducer = (
  state: CartState = initialCartState,
  action:
    | CartAction
    | { type: "INITIALIZE_CART"; payload: Pizza[] }
    | { type: "APPLY_DISCOUNT" }
    | { type: "CLEAR_CART" }
): CartState => {
  switch (action.type) {
    case "INITIALIZE_CART":
      const initialTotal = action.payload.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      return { ...state, cart: action.payload, totalPrice: initialTotal };

    case "ADD_TO_CART":
      const { pizza, userId } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === pizza.id
      );
      
      let newCart: Pizza[];
      if (existingItemIndex >= 0) {
        newCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity
                  ? item.quantity + pizza.quantity
                  : pizza.quantity,
              }
            : item
        );
      } else {
        newCart = [...state.cart, { ...pizza }];
      }
      const updatedTotal = newCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      if (userId) saveCart(newCart, userId);
      return { ...state, cart: newCart, totalPrice: updatedTotal };

    case "REMOVE_FROM_CART":
      const { id, userId: removeUserId } = action.payload;
      const updatedCart = state.cart.filter((item) => item.id !== id);
      const newTotal = updatedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      if (removeUserId) saveCart(updatedCart, removeUserId);
      return { ...state, cart: updatedCart, totalPrice: newTotal };

    case "UPDATE_QUANTITY":
      const { id: updateId, quantity, userId: updateUserId } = action.payload;
      const modifiedCart = state.cart.map((item) =>
        item.id === updateId ? { ...item, quantity } : item
      );
      const recalculatedTotal = modifiedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      if (updateUserId) saveCart(modifiedCart, updateUserId);
      return { ...state, cart: modifiedCart, totalPrice: recalculatedTotal };

    case "APPLY_DISCOUNT":
      if (state.cart.length === 0) return state;
      const lowestPricedItem = state.cart.reduce((prev, curr) =>
        prev.price < curr.price ? prev : curr
      );
      const discountTotal =
        state.totalPrice - lowestPricedItem.price * lowestPricedItem.quantity;
      return { ...state, totalPrice: discountTotal };

    case "CLEAR_CART":
      return { ...state, cart: [], totalPrice: 0 };

    default:
      return state;
  }
};



export const pizzaReducer = (
  state: Pizza[] = [],
  action: PizzaAction | CartAction
): Pizza[] => {
  switch (action.type) {
    case "ADD_PIZZA":
      return [...state, action.payload];
    case "UPDATE_PIZZA":
      return state.map((pizza) =>
        pizza.id === action.payload.id ? action.payload : pizza
      );
    case "DELETE_PIZZA":
      return state.filter((pizza) => pizza.id !== action.payload);
    default:
      return state;
  }
};

// Function to save cart data for a specific user
const saveCart = async (cart: Pizza[], userId: string) => {
  try {
    await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart", error);
  }
};

// Function to load cart data for a specific user
export const loadCart = async (userId: string): Promise<Pizza[]> => {
  try {
    const cart = await AsyncStorage.getItem(`cart_${userId}`);
    return cart
      ? JSON.parse(cart).map((item: any) => ({
          ...item,
          price:
            typeof item.price === "string"
              ? parseFloat(item.price)
              : item.price,
        }))
      : [];
  } catch (error) {
    console.error("Failed to load cart", error);
    return [];
  }
};
