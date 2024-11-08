// _layout.tsx
import React from "react";
import { Stack } from "expo-router";
import StoreProvider from "./redux/store";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StoreProvider> 
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Accueil",
              headerRight: () => <HeaderButtons />, 
            }}
          />
          <Stack.Screen
            name="screens/ProductList"
            options={{
              title: "Liste des Pizzas",
              headerRight: () => <HeaderButtons />,
            }}
          />
          <Stack.Screen
            name="screens/ProductDetail"
            options={{
              title: "Détails de la Pizza",
              headerRight: () => <HeaderButtons />, 
            }}
          />
          <Stack.Screen name="screens/Cart" options={{ title: "Mon panier" }} />
          <Stack.Screen
            name="screens/AdminPanel"
            options={{
              title: "Administration",
              headerRight: () => <HeaderButtons />, 
            }}
          />
          <Stack.Screen
            name="screens/LoginScreen"
            options={{
              title: "Se connecter",
              headerRight: () => <HeaderButtons />, 
            }}
          />
        </Stack>
      </StoreProvider>
    </AuthProvider>
  );
}

function HeaderButtons() {
  const router = useRouter();
  const { role, login, logout } = useAuth(); 

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => router.push("/screens/ProductList")}
        style={{ marginRight: 15 }}
      >
        <Icon name="pizza-outline" size={25} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/screens/Cart")}
        style={{ marginRight: 15 }}
      >
        <Icon name="cart-outline" size={25} color="#000" />
      </TouchableOpacity>

      {role === "admin" && ( 
        <TouchableOpacity
          onPress={() => router.push("/screens/AdminPanel")}
          style={{ marginRight: 15 }}
        >
          <Icon name="settings-outline" size={25} color="#000" />
        </TouchableOpacity>
      )}

      {role === "guest" ? ( 
        <TouchableOpacity
          onPress={() => router.push("/screens/LoginScreen")}
          style={{ marginRight: 15 }}
        >
          <Icon name="log-in-outline" size={25} color="#000" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            logout();
            router.push("/screens/LoginScreen");
          }}
          style={{ marginRight: 15 }}
        >
          <Icon name="log-out-outline" size={25} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
}
