import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen({ userId, userToken, setToken }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [changeData, setChangeData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    const askPermission = async () => {
      // Demander la permission d'accéder à la galerie photos
      let { status } = await ImagePicker.requestCameraRollPermissionsAsync();

      if (status !== "granted") {
        alert("You need to allow this");
      }
    };
    askPermission();
    fetchData();
  }, [changeData]);

  return (
    <View>
      {isLoading ? null : (
        <ScrollView>
          <View>
            <Text>userId : {userId}</Text>
            <Text>userToken : {userToken}</Text>
            <Text>username : {data.username}</Text>
            <Text>description : {data.description}</Text>
            <Image
              style={styles.imageFlat}
              source={{
                uri: `${data.photo[0].url}`,
              }}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="black"
              placeholder={data.username}
              onChangeText={(text) => {
                setUsername(text);
              }}
              value={username}
            />
            <TextInput
              style={styles.textArea}
              placeholderTextColor="black"
              multiline={true}
              numberOfLines={5}
              placeholder={data.description}
              onChangeText={(text) => {
                setDescription(text);
              }}
              value={description}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (username || description) {
                  const response = await axios.put(
                    `https://express-airbnb-api.herokuapp.com/user/update/${userId}`,
                    {
                      username: username,
                      description: description,
                    },
                    {
                      headers: {
                        Authorization: "Bearer " + userToken,
                      },
                    }
                  );
                  setUsername("");
                  setDescription("");
                  setChangeData(!changeData);
                } else {
                  alert("Vous devez remplir au moins un champ !");
                }
              }}
            >
              <Text style={styles.buttonText}>Mettre à jour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setToken(null);
              }}
            >
              <Text style={styles.buttonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageFlat: {
    height: 220,
  },
  input: {
    paddingLeft: 5,
    marginTop: 15,
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 20,
    color: "black",
    marginLeft: 30,
    marginRight: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#F2485B",
  },
  textArea: {
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 5,
    fontSize: 18,
    color: "black",
    marginLeft: 30,
    marginRight: 30,
    borderRightColor: "#F2485B",
    borderLeftColor: "#F2485B",
    borderTopColor: "#F2485B",
    borderBottomColor: "#F2485B",
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
    width: 230,
    height: 60,
    color: "#F2485B",
    backgroundColor: "white",
  },
});
