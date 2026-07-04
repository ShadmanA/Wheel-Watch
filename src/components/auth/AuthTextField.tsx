import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export function AuthTextField({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  keyboardType = "default",
  autoCapitalize = "none",
}: AuthTextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="flex-row items-center rounded-2xl border border-border px-5 py-2">
      <View className="flex-1">
        <Text className="text--caption">{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="font-poppins text-base text-text-primary"
        />
      </View>

      {isPassword ? (
        <Pressable
          onPress={() => setIsPasswordVisible((visible) => !visible)}
          hitSlop={8}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#6B7280"
          />
        </Pressable>
      ) : null}
    </View>
  );
}
