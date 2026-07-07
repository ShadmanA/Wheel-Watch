import { LinearGradient } from "expo-linear-gradient";
import { Image, type ImageSource } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme";

type HomeActionCardProps = {
  eyebrow?: string;
  title: string;
  buttonLabel: string;
  icon: ImageSource;
  iconWidth: number;
  iconHeight: number;
  onPress: () => void;
};

export function HomeActionCard({
  eyebrow,
  title,
  buttonLabel,
  icon,
  iconWidth,
  iconHeight,
  onPress,
}: HomeActionCardProps) {
  return (
    <View className="overflow-hidden rounded-[28px]">
      <LinearGradient
        colors={[colors.gradient.cardStart, colors.gradient.cardEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24 }}
      >
        <View className="gap-1">
          {eyebrow ? (
            <Text
              className="font-poppins-semibold text-sm text-white/90"
              style={{ maxWidth: "78%" }}
            >
              {eyebrow}
            </Text>
          ) : null}
          <Text
            className="font-poppins-bold text-2xl leading-8 text-white"
            style={{ maxWidth: "65%" }}
          >
            {title}
          </Text>
        </View>

        <Image
          source={icon}
          style={{
            position: "absolute",
            top: 20,
            right: 12,
            width: iconWidth,
            height: iconHeight,
          }}
          contentFit="contain"
        />

        <TouchableOpacity
          className="mt-10 self-start rounded-full bg-white px-6 py-3"
          activeOpacity={0.85}
          onPress={onPress}
        >
          <Text className="font-poppins-semibold text-base text-ww-deep-purple">
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
