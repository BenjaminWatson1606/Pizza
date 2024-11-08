import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  const handleStartOrder = () => {
    router.push('/screens/ProductList'); // Navigue vers la liste des produits
  };

  return (
    <ImageBackground
      source={{ uri: 'https://figuredepoulpe.com/wp-content/uploads/2021/06/pizzawanegaine-affiche-02-40X30-figuredepoulpe-expression-marseille-marseillais-eljulio-humour-illustration.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Bienvenue chez PizzaDistributor</Text>
        <Text style={styles.subtitle}>Cliquez ci-dessous pour commencer votre commande</Text>
        <TouchableOpacity style={styles.orderButton} onPress={handleStartOrder}>
          <Text style={styles.orderButtonText}>Commencer la commande</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Superposition sombre pour rendre le texte lisible
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  orderButton: {
    backgroundColor: '#ff6347', // Couleur rouge/orangée rappelant celle de Dominos
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  orderButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
