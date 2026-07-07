import Constants from "expo-constants";
import * as Device from "expo-device";
import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

// expo-notifications registers a push-token listener as a module-level side
// effect on import, and that listener setup throws immediately on Android in
// Expo Go (remote push was removed from Expo Go in SDK 53). Importing it
// dynamically, only when we know it's safe, keeps that side effect from ever
// running there instead of just catching it after the fact.
const pushNotificationsSupported = !(Platform.OS === "android" && isRunningInExpoGo());

if (pushNotificationsSupported) {
  import("expo-notifications").then((Notifications) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  });
}

// Requires a dev client (not Expo Go) on Android SDK 53+, and a physical
// device everywhere. Returns null instead of throwing when unavailable so
// callers can treat "no push token yet" as a normal, non-fatal case.
export async function registerForPushNotifications(): Promise<string | null> {
  if (!pushNotificationsSupported) return null;
  if (!Device.isDevice) return null;

  const Notifications = await import("expo-notifications");

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return data;
  } catch (error) {
    console.log("[push] failed to get push token:", error);
    return null;
  }
}
