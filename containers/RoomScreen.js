import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";

export default function RoomScreen({ route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [viewMore, setViewMore] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://airbnb-api.herokuapp.com/api/room/${route.params.id}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const renderStars = () => {
    const tab = [];
    for (let i = 0; i < 5; i++) {
      if (i < data.ratingValue) {
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
    <View style={{ backgroundColor: "white" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#F2485B" />
      ) : (
        <ScrollView style={{ backgroundColor: "white" }}>
          <View>
            <View style={styles.place}>
              <Text>{data.user.account.username.photos}</Text>
              <View style={{ position: "relative" }}>
                <Image
                  style={styles.imageFlat}
                  source={{
                    uri: `${data.photos[0]}`,
                  }}
                />
                <View style={styles.price}>
                  <Text style={{ color: "white", fontSize: 22 }}>
                    {data.price} €
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginVertical: 15 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 18, width: 250, paddingBottom: 10 }}
                  >
                    {data.title}
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
                      {data.reviews} avis
                    </Text>
                  </View>
                </View>
                <View>
                  <Image
                    style={styles.imageOwner}
                    source={{
                      uri: `${data.user.account.photos[0]}`,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  setViewMore(!viewMore);
                }}
              >
                <Text
                  numberOfLines={viewMore ? null : 4}
                  style={{ fontSize: 16, paddingVertical: 20 }}
                >
                  {data.description}
                </Text>
              </TouchableWithoutFeedback>
              <MapView
                initialRegion={{
                  latitude: data.loc[1],
                  longitude: data.loc[0],
                  latitudeDelta: 0.2,
                  longitudeDelta: 0.2,
                }}
                style={{ height: 200, width: "100%", marginBottom: 90 }}
              >
                <Marker
                  title="Location"
                  coordinate={{
                    latitude: data.loc[1],
                    longitude: data.loc[0],
                  }}
                />
              </MapView>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  place: {
    backgroundColor: "white",
    marginRight: 20,
    marginLeft: 20,
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
