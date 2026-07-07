import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EDGE_URL = process.env.EXPO_PUBLIC_EDGE_URL;
const REFRESH_INTERVAL_MS = 1000;

export default function LiveFeed() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <View className="flex-row items-center gap-2 px-6 pt-4">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </Pressable>
        <Text className="font-poppins-bold text-2xl text-white">Live Feed</Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Image
          source={{ uri: `${EDGE_URL}/snapshot?t=${tick}` }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}
