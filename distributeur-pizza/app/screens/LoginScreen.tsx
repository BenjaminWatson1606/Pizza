import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simulate authentication (replace with real API call later)
    if (username === "admin" && password === "passwordAdmin") {
      login("admin", `admin_${username}`);  
      router.push("/screens/AdminPanel");
    } else if (username === "user" && password === "password") {
      login("user", `user_${username}`); 
      router.push("/");
    } else if (username === "guest") {
      login("guest", "guest");  
      router.push("/");
    } else {
      Alert.alert("Login Failed", "Invalid username or password");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Se connecter</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
