import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions, Animated } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window'); // Width of the screen

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductList() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [addedPizzas, setAddedPizzas] = useState<{ [key: number]: boolean }>({});
  const [slideAnims, setSlideAnims] = useState<Animated.Value[]>([]); 
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pizzas');
        setPizzas(response.data);
        
        // Initialize animations for each item with starting point way off-screen to the left
        setSlideAnims(response.data.map(() => new Animated.Value(-width)));
      } catch (error) {
        console.error(error);
      }
    };

    fetchPizzas();
  }, []);

  useEffect(() => {
    slideAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [slideAnims]);

  const handleAddToCart = (item: Pizza) => {
    const pizzaWithQuantity = { ...item, quantity: 1 };
    dispatch(addToCart(pizzaWithQuantity, userId));

    setAddedPizzas((prevAddedPizzas) => ({
      ...prevAddedPizzas,
      [item.id]: true,
    }));

    setTimeout(() => {
      setAddedPizzas((prevAddedPizzas) => ({
        ...prevAddedPizzas,
        [item.id]: false,
      }));
    }, 1000);
  };

  const handleViewDetails = (item: Pizza) => {
    router.push({
      pathname: './ProductDetail',
      params: {
        id: item.id.toString(),
        name: item.name,
        price: item.price.toString(),
        description: item.description || "",
        image_url: item.image_url,
      },
    });
  };

  const renderItem = ({ item, index }: { item: Pizza; index: number }) => (
    <Animated.View style={{ transform: [{ translateX: slideAnims[index] }] }}>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          onError={(error) => console.error("Error loading image: ", error.nativeEvent.error)}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}€</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                addedPizzas[item.id] ? { backgroundColor: 'green' } : { backgroundColor: '#ff6347' },
              ]}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.buttonText}>
                {addedPizzas[item.id] ? 'Ajoutée' : 'Ajouter'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4682b4' }]}
              onPress={() => handleViewDetails(item)}
            >
              <Text style={styles.buttonText}>Détails</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://dominos.fr/medias/2022-Dominos-Mozzarella-Desktop.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <FlatList
          data={pizzas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  price: {
    fontSize: 16,
    marginBottom: 10,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
