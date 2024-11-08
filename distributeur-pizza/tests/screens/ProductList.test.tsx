import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import ProductList from '../../app/screens/ProductList';
import { addToCart } from '../../app/redux/actions';

jest.mock('axios');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
global.alert = jest.fn();

const mockPizzas = [
  {
    id: 1,
    name: 'Margherita',
    description: 'Classic pizza with tomato sauce and mozzarella',
    price: 10,
    image_url: 'https://example.com/margherita.jpg',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Pepperoni',
    description: 'Pepperoni pizza with spicy salami',
    price: 12,
    image_url: 'https://example.com/pepperoni.jpg',
    quantity: 1,
  },
];

describe('ProductList', () => {
  let mockPush: jest.Mock;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockDispatch = jest.fn();  // Directly mock dispatch
  // Convert `useDispatch` to `unknown` first, then to `jest.Mock`
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (axios.get as jest.Mock).mockResolvedValue({ data: mockPizzas });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls addToCart when the "Ajouter" button is pressed', async () => {
    const { getAllByText } = render(<ProductList />);

    await waitFor(() => {
      const addButton = getAllByText('Ajouter')[0];
      fireEvent.press(addButton);
    });

    console.log('Dispatch Calls:', mockDispatch.mock.calls);

    // Assurez-vous que le dispatch est appelé une seule fois avec les bons arguments
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_TO_CART',
      payload: {
        ...mockPizzas[0],
        quantity: 1,
      },
    });

    expect(global.alert).toHaveBeenCalledWith(
      `${mockPizzas[0].name} a été ajouté au panier!`
    );
  });
});
