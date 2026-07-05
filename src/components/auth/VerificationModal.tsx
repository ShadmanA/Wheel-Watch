import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onComplete: (code: string) => void;
};

export function VerificationModal({
  visible,
  email,
  onClose,
  onComplete,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digitsOnly);

    if (digitsOnly.length === CODE_LENGTH) {
      onComplete(digitsOnly);
      setCode("");
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      onShow={() => inputRef.current?.focus()}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "flex-end" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : undefined}
      >
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={handleClose}
        />

        <View className="gap-6 rounded-t-3xl bg-white px-6 pb-10 pt-8">
          <View className="items-center gap-2">
            <Text className="text--h3">Enter verification code</Text>
            <Text className="text--body-md text-center text-text-secondary">
              We sent a 6-digit code to{"\n"}
              <Text className="font-poppins-semibold text-text-primary">
                {email}
              </Text>
            </Text>
          </View>

          <Pressable onPress={() => inputRef.current?.focus()}>
            <View className="flex-row justify-between gap-2">
              {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <View
                  key={index}
                  className={`h-14 flex-1 items-center justify-center rounded-2xl border ${
                    index === code.length
                      ? "border-ww-deep-purple"
                      : "border-border"
                  }`}
                >
                  <Text className="font-poppins-semibold text-xl text-text-primary">
                    {code[index] ?? ""}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
