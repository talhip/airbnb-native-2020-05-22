import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function SignInScreen({ setToken, setId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F2485B" />
      <View style={{ backgroundColor: "#F2485B" }}>
        <FontAwesome name="home" size={164} color="white" style={styles.icon} />
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="white"
          placeholder="monmail@gmail.com"
          onChangeText={(text) => {
            setEmail(text);
          }}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="white"
          placeholder="•••••••"
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (email && password) {
              const response = await axios.post(
                "https://express-airbnb-api.herokuapp.com/user/log_in",
                {
                  email: email,
                  password: password,
                },
                {
                  "Content-Type": "application/json",
                }
              );
              const userToken = response.data.token;
              setToken(userToken);
              const userId = response.data.id;
              setId(userId);
            } else {
              alert("Tous les champs doivent être remplis !");
            }
          }}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2485B",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  icon: {
    textAlign: "center",
    paddingTop: 55,
    paddingBottom: 45,
  },
  input: {
    paddingLeft: 5,
    marginTop: 15,
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 20,
    color: "white",
    marginLeft: 30,
    marginRight: 30,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  button: {
    paddingTop: 60,
    alignItems: "center",
  },
  buttonText: {
    borderRadius: 50,
    fontSize: 28,
    textAlignVertical: "center",
    textAlign: "center",
    width: 200,
    height: 60,
    color: "#F2485B",
    backgroundColor: "white",
  },
  link: {
    marginTop: 30,
    color: "white",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
