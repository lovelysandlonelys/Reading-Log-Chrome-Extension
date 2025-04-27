import { getAuth, signInWithCredential, GoogleAuthProvider } from "./firebase-auth.js";

export async function googleLogin() {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://accounts.google.com/o/oauth2/auth?client_id=183603389063-386pleldsl0l0ganuctsi6a465112vuq.apps.googleusercontent.com&response_type=token&redirect_uri=https://${chrome.runtime.id}.chromiumapp.org/&scope=https://www.googleapis.com/auth/userinfo.profile`,
        interactive: true,
      },
      async (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error("🔥 OAuth Error:", chrome.runtime.lastError || "No redirect URL");
          reject(chrome.runtime.lastError || new Error("Failed to get auth token"));
          return;
        }

        console.log("✅ OAuth Redirect URL:", redirectUrl);

        // Extract the access token from the redirect URL
        const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
        const token = urlParams.get("access_token");
        if (!token) {
          console.error("🔥 No access token found in redirect URL");
          reject(new Error("No access token found"));
          return;
        }

        console.log("✅ Google OAuth Token:", token);

        // Use the token to sign in to Firebase
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(null, token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          console.log("✅ Firebase User:", userCredential.user);
          resolve(userCredential.user);
        } catch (error) {
          console.error("🔥 Firebase sign-in error:", error);
          reject(error);
        }
      }
    );
  });
}