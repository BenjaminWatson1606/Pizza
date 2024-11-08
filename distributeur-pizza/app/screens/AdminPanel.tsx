import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addPizza, updatePizza, deletePizza } from "../redux/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

// Define the Pizza type for clarity
interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
}

export default function AdminPanel() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { role } = useAuth();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [pizzaForm, setPizzaForm] = useState<Pizza>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    image_url: "",
    quantity: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pizzaToDelete, setPizzaToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (role !== "admin") {
      Alert.alert(
        "Access Denied",
        "You do not have permission to access the Admin Panel"
      );
      router.push("/");
    }
  }, [role]);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pizzas");
        setPizzas(response.data);
      } catch (error) {
        console.error("Error fetching pizzas:", error);
      }
    };
    fetchPizzas();
  }, []);

  const savePizza = async () => {
    if (!pizzaForm.name || pizzaForm.price <= 0 || !pizzaForm.description || !pizzaForm.image_url) {
      Alert.alert("Validation Error", "Veuillez remplir tous les champs avec des valeurs correctes.");
      return;
    }
  
    console.log("Pizza Form Data:", pizzaForm); 
  
    if (isEditing) {
      try {
        await axios.put(`http://localhost:3000/pizzas/${pizzaForm.id}`, pizzaForm);
        dispatch(updatePizza(pizzaForm));
        setPizzas(
          pizzas.map((pizza) => (pizza.id === pizzaForm.id ? pizzaForm : pizza))
        );
      } catch (error) {
        console.error("Error updating pizza:", error);
      }
    } else {
      try {
        const response = await axios.post("http://localhost:3000/pizzas", pizzaForm);
        const createdPizza = response.data as Pizza;
        dispatch(addPizza(createdPizza));
        setPizzas([...pizzas, createdPizza]);
      } catch (error) {
        console.error("Error adding pizza:", error);
      }
    }
    resetForm();
  };
  

  const resetForm = () => {
    setPizzaForm({
      id: 0,
      name: "",
      description: "",
      price: 0,
      image_url: "",
      quantity: 1,
    });
    setIsEditing(false);
  };
  

  const handleEdit = (pizza: Pizza) => {
    setPizzaForm(pizza);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setPizzaToDelete(id);
    setModalVisible(true);
  };

  const confirmDeletePizza = async () => {
    if (pizzaToDelete === null) return;
    try {
      await axios.delete(`http://localhost:3000/pizzas/${pizzaToDelete}`);
      dispatch(deletePizza(pizzaToDelete));
      setPizzas((prevPizzas) =>
        prevPizzas.filter((pizza) => pizza.id !== pizzaToDelete)
      );
      setModalVisible(false);
      setPizzaToDelete(null);
    } catch (error) {
      console.error("Error deleting pizza:", error);
    }
  };

  if (role !== "admin") return null;

  return (
    <View style={{ padding: 16 }}>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Etes-vous sûr de vouloir supprimer cette pizza ?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
              <Button title="Supprimer" onPress={confirmDeletePizza} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        {isEditing ? "Modifier Pizza" : "Ajouter Pizza"}
      </Text>

      <TextInput
        placeholder="Pizza Name"
        value={pizzaForm.name}
        onChangeText={(text) => setPizzaForm({ ...pizzaForm, name: text })}
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 8,
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Description"
        value={pizzaForm.description}
        onChangeText={(text) =>
          setPizzaForm({ ...pizzaForm, description: text })
        }
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 8,
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Price"
        keyboardType="numeric"
        value={pizzaForm.price ? pizzaForm.price.toString() : ""}
        onChangeText={(text) => {
          const parsedPrice = text ? parseFloat(text) : 0;
          setPizzaForm({ ...pizzaForm, price: parsedPrice });
        }}
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 8,
          padding: 8,
        }}
      />

      <TextInput
        placeholder="Image URL"
        value={pizzaForm.image_url}
        onChangeText={(text) => setPizzaForm({ ...pizzaForm, image_url: text })}
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 8,
          padding: 8,
        }}
      />

      <Button
        title={isEditing ? "Modifier Pizza" : "Ajouter Pizza"}
        onPress={savePizza}
      />

      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.pizzaItem}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.price}€</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={{ color: "blue" }}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: "red", marginLeft: 10 }}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pizzaItem: {
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
