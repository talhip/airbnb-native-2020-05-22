import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://airbnb-api.herokuapp.com/api/room?city=paris"
        );
        setData(response.data.rooms);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={{ backgroundColor: "white" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#F2485B" />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const renderStars = () => {
              const tab = [];
              for (let i = 0; i < 5; i++) {
                if (i < item.ratingValue) {
                  tab.push(
                    <FontAwesome
                      key={i}
                      name="star"
                      size={24}
                      color="#F7B100"
                      style={{ marginRight: 5 }}
                    />
                  );
                } else {
                  tab.push(
                    <FontAwesome
                      key={i}
                      name="star"
                      size={24}
                      color="#BBBBBB"
                      style={{ marginRight: 5 }}
                    />
                  );
                }
              }
              return tab;
            };
            return (
              <TouchableOpacity
                style={{ backgroundColor: "white" }}
                onPress={() => {
                  navigation.navigate("Room", { id: item._id });
                }}
              >
                <StatusBar barStyle="light-content" backgroundColor="#F2485B" />
                <View style={styles.place}>
                  <Text>{item.user.account.username.photos}</Text>
                  <View style={{ position: "relative" }}>
                    <Image
                      style={styles.imageFlat}
                      source={{
                        uri: `${item.photos[0]}`,
                      }}
                    />
                    <View style={styles.price}>
                      <Text style={{ color: "white", fontSize: 22 }}>
                        {item.price} €
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginVertical: 15 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 18, width: 250, paddingBottom: 10 }}
                      >
                        {item.title}
                      </Text>
                      <View style={styles.stars}>
                        {renderStars()}
                        <Text
                          style={{
                            color: "#BBBBBB",
                            fontSize: 16,
                            paddingLeft: 10,
                          }}
                        >
                          {item.reviews} avis
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Image
                        style={styles.imageOwner}
                        source={{
                          uri: `${item.user.account.photos[0]}`,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => String(item._id)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  place: {
    backgroundColor: "white",
    marginRight: 20,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#BBBBBB",
  },
  imageFlat: {
    width: "100%",
    height: 220,
  },
  price: {
    height: 40,
    width: 80,
    backgroundColor: "black",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
  },
  stars: {
    flexDirection: "row",
  },
  imageOwner: {
    borderRadius: 50,
    height: 60,
    width: 60,
  },
});
