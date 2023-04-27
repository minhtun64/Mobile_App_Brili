import { database } from "../firebase";
import { ref, get } from "firebase/database";

const getStatusInfo = async (postId) => {
  try {
    const statusRef = ref(database, `post/${postId}`);
    const statusSnapshot = await get(statusRef);
    const statusData = statusSnapshot.val();

    if (statusData) {
      const userId = statusData.user_id;
      const userRef = ref(database, `user/${userId}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      const statusInfo = {
        userId,
        userName: userData.name,
        userAvatar: userData.avatar,
        content: statusData.content,
        image: statusData.image,
        date: statusData.date,
      };

      return statusInfo;
    } else {
      throw new Error("Status not found.");
    }
  } catch (error) {
    console.error("Error retrieving status information:", error);
    throw error;
  }
};
export default getStatusInfo;
