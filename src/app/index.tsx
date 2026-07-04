import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";

const primarySwatches = [
  { label: "WW Purple", className: "bg-ww-purple" },
  { label: "WW Deep Purple", className: "bg-ww-deep-purple" },
  { label: "WW Blue", className: "bg-ww-blue" },
  { label: "WW Green", className: "bg-ww-green" },
];

const semanticSwatches = [
  { label: "Success", className: "bg-success" },
  { label: "Warning", className: "bg-warning" },
  { label: "Danger", className: "bg-danger" },
  { label: "Error", className: "bg-error" },
  { label: "Info", className: "bg-info" },
];

function ColorRow({
  title,
  swatches,
}: {
  title: string;
  swatches: { label: string; className: string }[];
}) {
  return (
    <View className="w-full gap-3">
      <Text className="text--h3">{title}</Text>
      <View className="flex-row flex-wrap gap-4">
        {swatches.map((swatch) => (
          <View key={swatch.label} className="items-center gap-2">
            <View
              className={`h-14 w-14 rounded-xl border border-border ${swatch.className}`}
            />
            <Text className="text--caption">{swatch.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function Index() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="items-center gap-8 px-6 py-20"
    >
      <Image
        source={images.wwLogo}
        style={{ width: 72, height: 72 }}
        contentFit="contain"
      />

      <View className="items-center gap-2">
        <Text className="text--h1">Wheel Watch</Text>
        <Text className="text--body-lg text-center">
          A revolutionary vehicle surveillance platform for automotive vehicles.
        </Text>
      </View>

      <TouchableOpacity
        className="rounded-full bg-ww-deep-purple px-6 py-3"
        activeOpacity={0.85}
        onPress={() => router.push("/onboarding")}
      >
        <Text className="font-poppins-semibold text-base text-white">
          View Onboarding
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
