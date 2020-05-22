import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen({ userId, userToken, setToken }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [changeData, setChangeData] = useState(false);
  const [changeImage, setChangeImage] = useState(false);

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
    const uploadImage = async () => {
      let { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== "granted") {
        alert("Vous devez valider cette autorisation !");
      }
    };
    uploadImage();
    fetchData();
  }, [changeData, changeImage]);

  return (
    <View style={{ backgroundColor: "white" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#F2485B" />
      ) : (
        <ScrollView>
          <View style={{ backgroundColor: "white", paddingBottom: 140 }}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  let result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                  });
                  setImage(result.uri);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              {data.photo[0].url && !image ? (
                <Image
                  style={styles.imageFlat}
                  source={{
                    uri: `${data.photo[0].url}`,
                  }}
                />
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={async () => {
                      setIsLoading(true);
                      const uri = image;
                      const uriParts = uri.split(".");
                      const fileType = uriParts[uriParts.length - 1];
                      const formData = new FormData();
                      formData.append("photo", {
                        uri,
                        name: `photo.${fileType}`,
                        type: `image/${fileType}`,
                      });
                      console.log(formData);

                      try {
                        const response = await axios.put(
                          `https://express-airbnb-api.herokuapp.com/user/upload_picture/${userId}`,
                          formData,
                          {
                            headers: {
                              Authorization: "Bearer " + userToken,
                              Accept: "application/json",
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );
                        setImage("");
                        setChangeImage(!changeImage);
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <ImageBackground
                      style={[styles.imageFlat, { justifyContent: "center" }]}
                      source={{
                        uri: `${image}`,
                      }}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            alignSelf: "center",
                            fontSize: 22,
                            width: 170,
                            height: 40,
                            backgroundColor: "#f2b0b7",
                            color: "white",
                          },
                        ]}
                      >
                        Valider l'image
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              )}
              {image ? null : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    try {
                      let result = await ImagePicker.launchImageLibraryAsync({
                        allowsEditing: true,
                      });
                      setImage(result.uri);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                ></TouchableOpacity>
              )}
            </TouchableOpacity>

            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#BBBBBB"
              placeholder={data.username}
              onChangeText={(text) => {
                setUsername(text);
              }}
              value={username}
            />
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#BBBBBB"
              placeholder={data.email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              value={email}
            />
            <TextInput
              style={styles.textArea}
              placeholderTextColor="#BBBBBB"
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
                if (username || email || description) {
                  setIsLoading(true);
                  const response = await axios.put(
                    `https://express-airbnb-api.herokuapp.com/user/update/${userId}`,
                    {
                      username: username,
                      email: email,
                      description: description,
                    },
                    {
                      headers: {
                        Authorization: "Bearer " + userToken,
                      },
                    }
                  );
                  setUsername("");
                  setEmail("");
                  setDescription("");
                  setChangeData(!changeData);
                } else {
                  alert("Vous devez remplir au moins un champ !");
                }
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: 22,
                    width: 170,
                    height: 40,
                    backgroundColor: "#f2b0b7",
                    color: "white",
                  },
                ]}
              >
                Mettre à jour
              </Text>
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
    marginTop: 40,
    borderRadius: 5,
    alignSelf: "center",
    width: 180,
    height: 180,
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
    paddingTop: 40,
    alignItems: "center",
  },
  buttonText: {
    borderRadius: 50,
    fontSize: 24,
    textAlignVertical: "center",
    textAlign: "center",
    width: 210,
    height: 50,
    color: "white",
    backgroundColor: "#F2485B",
  },
});
