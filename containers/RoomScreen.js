import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/core";
import { StyleSheet, Image, Text, View, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";

export default function RoomScreen({ route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
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
        tab.push(<FontAwesome key={i} name="star" size={24} color="yellow" />);
      } else {
        tab.push(<FontAwesome key={i} name="star" size={24} color="grey" />);
      }
    }
    return tab;
  };
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#F2485B" />
      ) : (
        <ScrollView>
          <View>
            <Text>{data.user.account.username.photos}</Text>
            <Image
              style={styles.imageFlat}
              source={{
                uri: `${data.photos[0]}`,
              }}
            />
            <Text>{data.price} €</Text>
            <Text>{data.reviews} avis</Text>
            <Text>{data.ratingValue} / 5</Text>
            <Text>{data.description}</Text>
            <View>{renderStars()}</View>
            <Image
              style={styles.imageOwner}
              source={{
                uri: `${data.user.account.photos[0]}`,
              }}
            />
            <MapView
              initialRegion={{
                latitude: data.loc[1],
                longitude: data.loc[0],
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }}
              style={{ height: 200, width: "100%" }}
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
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageFlat: {
    height: 220,
  },
  imageOwner: {
    borderRadius: 50,
    height: 60,
    width: 60,
  },
});
