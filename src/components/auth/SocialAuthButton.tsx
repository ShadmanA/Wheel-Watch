import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

type SocialProvider = "google" | "facebook" | "apple";

const SOCIAL_CONFIG: Record<
  SocialProvider,
  { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  google: {
    label: "Continue with Google",
    icon: "logo-google",
    color: "#4285F4",
  },
  facebook: {
    label: "Continue with Facebook",
    icon: "logo-facebook",
    color: "#1877F2",
  },
  apple: {
    label: "Continue with Apple",
    icon: "logo-apple",
    color: "#000000",
  },
};

type SocialAuthButtonProps = {
  provider: SocialProvider;
  onPress?: () => void;
};

export function SocialAuthButton({ provider, onPress }: SocialAuthButtonProps) {
  const { label, icon, color } = SOCIAL_CONFIG[provider];

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 rounded-2xl border border-border px-5 py-4"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={color} />
      <Text className="font-poppins-medium text-base text-text-primary">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
