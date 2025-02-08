import { getNDK } from "./nostr";

export const fetchUserProfile = async (pubkey: string) => {
  // WIP: Return a tikstr standard user profile object not the default NDKUserProfile
  try {
    const ndk = await getNDK();
    const user = ndk.getUser({ pubkey });
    return await user.fetchProfile();
  } catch (e) {
    console.error("Error fetching user profile:", e);
    return null;
  }
};

export const fetchUser = async (pubkey: string) => {
  try {
    const ndk = await getNDK();
    return ndk.getUser({ pubkey });
  } catch (e) {
    console.error("Error fetching user:", e);
    return null;
  }
};
