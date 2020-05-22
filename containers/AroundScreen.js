import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function ProfileScreen({ userToken }) {
  const [coords, setCoords] = useState(null);
  const [data, setData] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const askPermission = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const newCoords = { ...coords };
        newCoords.latitude = location.coords.latitude;
        newCoords.longitude = location.coords.longitude;
        setCoords(newCoords);
        setIsLoadingLocation(false);
      } else {
        setErrMsg(
          "Il faut accepter la permission d'accès à la localisation pour utiliser l'application"
        );
      }
    };
    askPermission();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://airbnb-api.herokuapp.com/api/room/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
      );
      setData(response.data);
      setIsLoadingData(false);
    };
    if (coords) {
      fetchData();
    }
  }, [coords, isLoadingLocation]);

  return (
    <View>
      {!isLoadingData && !isLoadingLocation ? (
        <View>
          <MapView
            showsUserLocation={true}
            initialRegion={{
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.2,
              longitudeDelta: 0.2,
            }}
            style={{ height: "100%", width: "100%" }}
          >
            {data.map((item) => {
              return (
                <MapView.Marker
                  key={item._id}
                  coordinate={{
                    latitude: item.loc[1],
                    longitude: item.loc[0],
                  }}
                />
              );
            })}
          </MapView>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#F2485B" />
      )}
    </View>
  );
}
