import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions';
import { useAuth } from '@/contexts/AuthContext';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id, name, description, price, image_url } = useLocalSearchParams();
  const { userId } = useAuth();


  const pizza: Pizza = {
    id: Number(id),
    name: String(name),
    description: String(description),
    price: Number(price),
    image_url: String(image_url),
  };

  const [quantity, setQuantity] = useState<number>(1); 

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (pizza) {
      const pizzaWithQuantity = { ...pizza, quantity }; 
      dispatch(addToCart(pizzaWithQuantity, userId)); 
      router.push('/screens/Cart');
    }
  };
  

  const totalPrice = (quantity * pizza.price).toFixed(2); 

  return (
    <ImageBackground
      source={{ uri: 'https://www.dominos.fr/medias/2022-Dominos-Mozzarella-Desktop.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={{ uri: pizza.image_url }}
            style={styles.image}
            onError={(error) => console.error("Error loading image: ", error.nativeEvent.error)}
          />
          <Text style={styles.name}>{pizza.name}</Text>
          <Text style={styles.description}>{pizza.description}</Text>
          <Text style={styles.price}>Prix unitaire: {pizza.price}€</Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantité :</Text>
            <RNPickerSelect
              onValueChange={(value) => setQuantity(Number(value))}
              items={[...Array(10).keys()].map((num) => ({
                label: `${num + 1}`,
                value: num + 1,
              }))}
              value={quantity}
              style={pickerSelectStyles}
            />
          </View>

          <Text style={styles.totalPrice}>Prix total: {totalPrice}€</Text>

          <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Ajouter au panier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/screens/ProductList')}>
            <Text style={styles.backButtonText}>Retour à la liste</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  price: {
    fontSize: 22,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 24,
    color: '#ff6347',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#4682b4',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    textAlign: 'center',
    width: 95,
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    textAlign: 'center',
    width: 95,
  },
});
