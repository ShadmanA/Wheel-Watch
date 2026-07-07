import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeActionCard } from "@/components/HomeActionCard";
import { images } from "@/constants/images";
import { registerDevice } from "@/lib/api";
import { registerForPushNotifications } from "@/lib/notifications";
import { colors } from "@/theme";

const DEVICE_ID = process.env.EXPO_PUBLIC_DEVICE_ID as string;

export default function Home() {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    (async () => {
      const pushToken = await registerForPushNotifications();
      if (!pushToken) return;

      const token = await getToken();
      if (!token) return;

      try {
        await registerDevice(token, DEVICE_ID, pushToken);
      } catch (error) {
        console.log("[push] failed to register device push token:", error);
      }
    })();
  }, [getToken]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 gap-6 px-6 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: user?.imageUrl }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
            <Text className="font-poppins-bold text-2xl text-text-primary">
              Hello {user?.firstName ?? "User"}!
            </Text>
          </View>

          <Ionicons
            name="notifications-outline"
            size={26}
            color={colors.neutral.textPrimary}
          />
        </View>

        <HomeActionCard
          eyebrow="View Live Camera Feed"
          title="View Live Camera Feed"
          buttonLabel="View Feed"
          icon={images.surveillance}
          iconWidth={180}
          iconHeight={200}
          onPress={() => router.push("/live-feed")}
        />

        <HomeActionCard
          title="View Map"
          buttonLabel="View Map"
          icon={images.map}
          iconWidth={110}
          iconHeight={140}
          onPress={() => router.push("/map")}
        />
      </View>
    </SafeAreaView>
  );
}
