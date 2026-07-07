import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { enrollFace, registerDevice } from "@/lib/api";

const DEVICE_ID = process.env.EXPO_PUBLIC_DEVICE_ID as string;

export default function FaceCapture() {
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = async (photoUri: string) => {
    setIsUploading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not signed in");

      // Link this account to the car's edge device before enrolling, so
      // the backend knows which device's embedding to save against.
      await registerDevice(token, DEVICE_ID, "");
      const result = await enrollFace(token, photoUri);

      if (!result.success) {
        Alert.alert("Couldn't verify your face", result.reason ?? "Please try again.");
        return;
      }
      router.replace("/home");
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleTakePicture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Camera access is required to verify your face.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const handleUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Photo library access is required to verify your face.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-6 pb-6 pt-4">
        <View className="items-center">
          <Image
            source={images.wwLogo}
            style={{ width: 56, height: 56 }}
            contentFit="contain"
          />
        </View>

        <Pressable
          className="self-start py-4"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#0D132A" />
        </Pressable>

        <View className="gap-2">
          <Text className="font-poppins-bold text-3xl leading-9 text-text-primary">
            One more step
          </Text>
          <Text className="font-poppins-bold text-3xl leading-9 text-text-primary">
            Please take a picture{"\n"}of your face
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <Image
            source={images.snap}
            style={{ width: "75%", height: 220 }}
            contentFit="contain"
          />
        </View>

        <View className="gap-4">
          <TouchableOpacity
            className="flex-row items-center justify-between rounded-full bg-ww-deep-purple px-8 py-5"
            activeOpacity={0.85}
            onPress={handleTakePicture}
            disabled={isUploading}
          >
            <Text className="font-poppins-semibold text-lg text-white">
              {isUploading ? "Verifying..." : "Take a picture"}
            </Text>
            <Text className="font-poppins-bold text-2xl text-white">›</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Text className="text--body-sm">or</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <TouchableOpacity
            className="items-center rounded-full border border-border py-5"
            activeOpacity={0.85}
            onPress={handleUploadPhoto}
            disabled={isUploading}
          >
            <Text className="font-poppins-semibold text-lg text-text-primary">
              Upload from your phone
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="mt-8 text-center text--body-sm">
          Verification is fast and secure.
        </Text>
      </View>
    </SafeAreaView>
  );
}
