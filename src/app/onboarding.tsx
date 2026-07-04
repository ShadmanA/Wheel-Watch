import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

export default function Onboarding() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-6 pb-6 pt-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={images.wwLogo}
            style={{ width: 68, height: 68 }}
            contentFit="contain"
          />
          <View>
            <Text className="font-poppins-bold text-3xl leading-9 text-text-primary">
              Wheel Watch
            </Text>
          </View>
        </View>

        <View className="mt-8 gap-4">
          <Text className="font-poppins-bold text-3xl leading-tight text-text-primary">
            Your <Text className="text-ww-deep-purple">Car</Text>
            {"\n"}
            <Text className="text-ww-deep-purple">Surveillance Partner</Text>
          </Text>
          <Text className="font-poppins text-lg leading-7 text-text-primary">
            Real-time car alerts,{"\n"}anytime, anywhere
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <Image
            source={images.carSafe}
            style={{
              width: "200%",
              height: "100%",
            }}
            contentFit="contain"
          />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-between rounded-full bg-ww-deep-purple px-8 py-5"
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text className="font-poppins-semibold text-lg text-white">
            Get Started
          </Text>
          <Text className="font-poppins-bold text-2xl text-white">›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
