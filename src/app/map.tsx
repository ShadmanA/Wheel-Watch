import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { getTheftLocations } from "@/lib/api";

type TheftLocation = {
  id: string;
  lat: number;
  lon: number;
  description: string;
};

export default function Map() {
  const [locations, setLocations] = useState<TheftLocation[]>([]);

  useEffect(() => {
    getTheftLocations()
      .then((result) => setLocations(result.locations))
      .catch((error) => console.log("[map] failed to load theft locations:", error));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-row items-center gap-2 px-6 pt-4">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#0D132A" />
        </Pressable>
        <Text className="font-poppins-bold text-2xl text-text-primary">
          Reported Thefts
        </Text>
      </View>

      <MapView
        style={{ flex: 1, marginTop: 16 }}
        initialRegion={{
          latitude: locations[0]?.lat ?? 37.7749,
          longitude: locations[0]?.lon ?? -122.4194,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.lat, longitude: location.lon }}
            title="Reported theft"
            description={location.description}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}
