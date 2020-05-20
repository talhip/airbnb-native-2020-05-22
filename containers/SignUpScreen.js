import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

export default function SignUpScreen({ setToken, setId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F2485B" />
      <ScrollView>
        <View style={{ backgroundColor: "#F2485B" }}>
          <Text style={styles.h1}>Rejoignez-nous !</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="white"
            placeholder="email"
            onChangeText={(text) => {
              setEmail(text);
            }}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="white"
            placeholder="pseudo"
            onChangeText={(text) => {
              setUsername(text);
            }}
            value={username}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="white"
            placeholder="prénom"
            onChangeText={(text) => {
              setName(text);
            }}
            value={name}
          />
          <TextInput
            style={styles.textArea}
            placeholderTextColor="white"
            multiline={true}
            numberOfLines={5}
            placeholder="présentez-vous en quelques mots..."
            onChangeText={(text) => {
              setDescription(text);
            }}
            value={description}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="white"
            placeholder="mot de passe"
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
            }}
            value={password}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="white"
            placeholder="confirmez le mot de passe"
            secureTextEntry={true}
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
            value={confirmPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (
                email &&
                username &&
                name &&
                description &&
                password &&
                confirmPassword
              ) {
                if (confirmPassword === password) {
                  const response = await axios.post(
                    "https://express-airbnb-api.herokuapp.com/user/sign_up",
                    {
                      email: email,
                      username: username,
                      name: name,
                      description: description,
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
                  alert("Les mots de passe doivent être identiques !");
                }
              } else {
                alert("Tous les champs doivent être remplis !");
              }
            }}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2485B",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  h1: {
    paddingTop: 10,
    color: "white",
    textAlign: "center",
    fontSize: 26,
  },
  input: {
    paddingLeft: 5,
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18,
    color: "white",
    marginLeft: 30,
    marginRight: 30,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  textArea: {
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 5,
    fontSize: 18,
    color: "white",
    marginLeft: 30,
    marginRight: 30,
    borderRightColor: "white",
    borderLeftColor: "white",
    borderTopColor: "white",
    borderBottomColor: "white",
    borderWidth: 1,
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
