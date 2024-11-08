export interface Pizza {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  quantity: number;
}

// Cart Actions
export const addToCart = (pizza: Pizza, userId: string) => ({
  type: 'ADD_TO_CART' as const,
  payload: { pizza, userId },
});

export const removeFromCart = (id: number, userId: string) => ({
  type: 'REMOVE_FROM_CART' as const,
  payload: { id, userId },
});

export const updateQuantity = (id: number, quantity: number, userId: string) => ({
  type: 'UPDATE_QUANTITY' as const,
  payload: { id, quantity, userId },
});

// Pizza CRUD Actions
export const addPizza = (pizza: Pizza) => ({
  type: 'ADD_PIZZA' as const,
  payload: pizza,
});

export const updatePizza = (pizza: Pizza) => ({
  type: 'UPDATE_PIZZA' as const,
  payload: pizza,
});

export const deletePizza = (id: number) => ({
  type: 'DELETE_PIZZA' as const,
  payload: id,
});

// Combined Action Types
export type CartAction = 
  | ReturnType<typeof addToCart>
  | ReturnType<typeof removeFromCart>
  | ReturnType<typeof updateQuantity>;

export type PizzaAction = 
  | ReturnType<typeof addPizza>
  | ReturnType<typeof updatePizza>
  | ReturnType<typeof deletePizza>;
