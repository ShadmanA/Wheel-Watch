import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export type SocialProvider = "google" | "facebook" | "apple";

const STRATEGIES: Record<SocialProvider, "oauth_google" | "oauth_facebook" | "oauth_apple"> = {
  google: "oauth_google",
  facebook: "oauth_facebook",
  apple: "oauth_apple",
};

export function useSocialAuth() {
  const { startSSOFlow } = useSSO();

  const signInWithProvider = async (provider: SocialProvider) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: STRATEGIES[provider],
        redirectUrl: Linking.createURL("/oauth-native-callback"),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Sign in failed", "Something went wrong. Please try again.");
    }
  };

  return { signInWithProvider };
}
