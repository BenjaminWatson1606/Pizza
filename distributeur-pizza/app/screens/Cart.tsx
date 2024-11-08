import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/actions";
import { RootState } from "../redux/store";
import { useAuth } from "@/contexts/AuthContext";
import { loadCart } from "../redux/reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pizza } from "../redux/actions";
import { FontAwesome } from "@expo/vector-icons"; // Make sure to have @expo/vector-icons installed

export default function Cart() {
  const cartItems = useSelector((state: RootState) => state.cart.cart);
  const { userId } = useAuth();
  const dispatch = useDispatch();
  const [points, setPoints] = useState(0);
  const [showTick, setShowTick] = useState(false); // For controlling tick visibility
  const tickOpacity = useState(new Animated.Value(0))[0]; // Animation for the tick

  useEffect(() => {
    const initializeCart = async () => {
      if (userId) {
        const storedCart = await loadCart(userId);
        dispatch({ type: "INITIALIZE_CART", payload: storedCart });
      }

      // Load points from AsyncStorage for the specific user
      const savedPoints = await AsyncStorage.getItem(`points_${userId}`);
      setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
    };
    initializeCart();
  }, [userId, dispatch]);

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id, userId));
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateQuantity(id, quantity, userId));
  };

  // Calculate total price
  const totalPrice = cartItems
    .reduce((total: number, item: { price: number; quantity: number }) => {
      return total + item.price * item.quantity;
    }, 0)
    .toFixed(2);

  // Function to place the order
  const placeOrder = async () => {
    if (cartItems.length === 0 || userId === "guest") return;

    const pointsEarned = cartItems.reduce(
      (total: number, item: Pizza) => total + item.quantity * 100,
      0
    );

    const newPoints = points + pointsEarned;
    setPoints(newPoints);
    await AsyncStorage.setItem(`points_${userId}`, newPoints.toString());

    if (newPoints >= 1000) {
      alert(
        "Félicitation ! Vous bénéficiez d'une pizza gratuite sur votre prochaine commande"
      );
    }

    // Show tick animation
    setShowTick(true);
    Animated.sequence([
      Animated.timing(tickOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(tickOpacity, { toValue: 0, duration: 500, delay: 1000, useNativeDriver: true })
    ]).start(() => setShowTick(false));

    dispatch({ type: "CLEAR_CART" });
    await AsyncStorage.removeItem(`cart_${userId}`);
  };

  const redeemFreePizza = async () => {
    if (points < 1000 || cartItems.length === 0) return;

    const updatedPoints = points - 1000;
    setPoints(updatedPoints);
    await AsyncStorage.setItem(`points_${userId}`, updatedPoints.toString());

    // Find the lowest priced item in the cart
    const lowestPricedItemIndex = cartItems.reduce(
      (lowestIndex: number, item: Pizza, index: number, array: Pizza[]) =>
        item.price < array[lowestIndex].price ? index : lowestIndex,
      0
    );

    // Create a new cart with the discount applied
    const discountedCart = cartItems.map((item: Pizza, index: number) =>
      index === lowestPricedItemIndex ? { ...item, price: 0 } : item
    );

    // Dispatch the updated cart and save to AsyncStorage
    dispatch({ type: "INITIALIZE_CART", payload: discountedCart });
    await AsyncStorage.setItem(
      `cart_${userId}`,
      JSON.stringify(discountedCart)
    );

    alert("Vous avez une pizza offerte!");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://www.dominos.fr/medias/2022-Dominos-Mozzarella-Desktop.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.pointsText}>Points: {points}</Text>
        {points >= 1000 && cartItems.length > 0 && (
          <TouchableOpacity
            style={styles.freePizzaButton}
            onPress={redeemFreePizza}
          >
            <Text style={styles.freePizzaButtonText}>
              Obtenir une pizza gratuite
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <View style={styles.detailsContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>Prix unitaire: {item.price}€</Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityDisplay}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromCart(item.id)}
                >
                  <Text style={styles.removeButtonText}>Retirer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: {totalPrice}€</Text>
          <TouchableOpacity
            style={[
              styles.orderButton,
              (cartItems.length === 0 || userId === "guest") && {
                opacity: 0.5,
              },
            ]}
            onPress={placeOrder}
            disabled={cartItems.length === 0 || userId === "guest"}
          >
            <Text style={styles.orderButtonText}>Commander</Text>
          </TouchableOpacity>
        </View>

        {/* Green tick overlay */}
        {showTick && (
        <Animated.View style={[styles.tickContainer, { opacity: tickOpacity }]}>
          <FontAwesome name="check-circle" size={150} color="#32CD32" style={styles.tickIcon} />
        </Animated.View>
      )}
      </View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#888",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ff6347",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityDisplay: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    marginTop: 10,
  },
  removeButtonText: {
    color: "#ff6347",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 20,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  totalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  orderButton: {
    backgroundColor: "#ff6347",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  pointsText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  freePizzaButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  freePizzaButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tickContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -75 }], 
    justifyContent: "center",
    alignItems: "center",
  },
  tickIcon: {
    shadowColor: "#32CD32", 
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
  },
});
