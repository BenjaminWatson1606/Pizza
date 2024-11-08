import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Index from '../app/index';
import { useRouter } from 'expo-router';

// Mock de useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Index Screen', () => {
  it('renders correctly with title and subtitle', () => {
    const { getByText } = render(<Index/>);

    expect(getByText('Bienvenue chez PizzaDistributor')).toBeTruthy();
    expect(getByText('Cliquez ci-dessous pour commencer votre commande')).toBeTruthy();
  });

  it('navigates to ProductList screen when order button is pressed', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    const { getByText } = render(<Index />);
    const orderButton = getByText('Commencer la commande');

    fireEvent.press(orderButton);

    expect(pushMock).toHaveBeenCalledWith('/screens/ProductList');
  });
});
