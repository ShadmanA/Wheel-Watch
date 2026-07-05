import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthTextField } from "@/components/auth/AuthTextField";
import { SocialAuthButton } from "@/components/auth/SocialAuthButton";
import { VerificationModal } from "@/components/auth/VerificationModal";
import { images } from "@/constants/images";
import { useSocialAuth } from "@/hooks/useSocialAuth";

export default function SignIn() {
  const { signIn } = useSignIn();
  const { signInWithProvider } = useSocialAuth();

  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session }) => {
        if (!session?.currentTask) {
          router.replace("/");
        }
      },
    });
  };

  const handleSignIn = async () => {
    setIsSubmitting(true);
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Sign in failed", error.longMessage ?? error.message);
      return;
    }

    setIsVerifying(true);
  };

  const handleVerify = async (code: string) => {
    const { error } = await signIn.emailCode.verifyCode({ code });

    if (error) {
      Alert.alert("Invalid code", error.longMessage ?? error.message);
      return;
    }

    if (signIn.status === "complete") {
      setIsVerifying(false);
      await finalizeSignIn();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerClassName="pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            className="self-start py-4"
            hitSlop={8}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0D132A" />
          </Pressable>

          <View className="gap-2">
            <Text className="font-poppins-bold text-3xl leading-9 text-text-primary">
              Welcome back
            </Text>
            <Text className="font-poppins text-base text-text-secondary">
              Log in to keep watch over your car
            </Text>
          </View>

          <View className="items-center justify-center py-6">
            <Image
              source={images.carRed}
              style={{ width: "72%", height: 160 }}
              contentFit="contain"
            />
          </View>

          <View className="gap-4">
            <AuthTextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            className="mt-6 items-center rounded-2xl bg-ww-deep-purple py-4"
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={!email || isSubmitting}
          >
            <Text className="font-poppins-semibold text-lg text-white">
              Sign In
            </Text>
          </TouchableOpacity>

          <View className="my-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Text className="text--body-sm">or continue with</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="gap-3">
            <SocialAuthButton
              provider="google"
              onPress={() => signInWithProvider("google")}
            />
            <SocialAuthButton
              provider="facebook"
              onPress={() => signInWithProvider("facebook")}
            />
            <SocialAuthButton
              provider="apple"
              onPress={() => signInWithProvider("apple")}
            />
          </View>

          <View className="mt-8 flex-row justify-center gap-1">
            <Text className="text--body-md">Don&apos;t have an account?</Text>
            <Pressable onPress={() => router.replace("/sign-up")}>
              <Text className="font-poppins-semibold text-body-md text-ww-deep-purple">
                Sign up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={isVerifying}
        email={email || "your email"}
        onClose={() => setIsVerifying(false)}
        onComplete={handleVerify}
      />
    </SafeAreaView>
  );
}
