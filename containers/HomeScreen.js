import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

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
    <View>
      {isLoading ? null : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Room", { id: item._id });
              }}
            >
              <View>
                <Text>{item.user.account.username.photos}</Text>
                <Image
                  style={styles.imageFlat}
                  source={{
                    uri: `${item.photos[0]}`,
                  }}
                />
                <Text>{item.price} €</Text>
                <Text>{item.reviews} avis</Text>
                <Text>{item.ratingValue} / 5</Text>
                <Text>{item.description}</Text>
                <Image
                  style={styles.imageOwner}
                  source={{
                    uri: `${item.user.account.photos[0]}`,
                  }}
                />
                <Text>------------------------------------------------</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => String(item._id)}
        />
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
    height: 70,
    width: 70,
  },
});
