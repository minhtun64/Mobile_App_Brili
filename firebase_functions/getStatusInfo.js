import { database } from "../firebase";
import { ref, get } from "firebase/database";
import { formatDate } from "../components/utils";

const getStatusInfo = async (postId) => {
  try {
    // Lấy thông tin của bài viết
    const statusRef = ref(database, `post/${postId}`);
    const statusSnapshot = await get(statusRef);
    const statusData = statusSnapshot.val();

    if (statusData) {
      const userId = statusData.user_id;
      const userRef = ref(database, `user/${userId}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      // Định dạng lại ngày tháng
      const formattedDate = formatDate(statusData.date);

      // Lấy danh sách những người đã thích bài viết
      const likesSnapshot = await get(ref(database, `like/${postId}`));
      const likesData = likesSnapshot.val();
      const likedUsers = [];
      for (const userId in likesData) {
        const userLikes = likesData[userId];
        for (const commentId in userLikes) {
          if (commentId === "0") {
            likedUsers.push({
              userId: userId,
            });
          }
        }
      }

      // Lấy danh sách những người đã bình luận bài viết
      const commentsSnapshot = await get(ref(database, `comment`));
      const commentsData = commentsSnapshot.val();
      const commentedUsers = [];

      for (const commentKey in commentsData) {
        const comment = commentsData[commentKey];
        if (comment.post_id == postId) {
          commentedUsers.push({
            commentId: commentKey,
          });
        }
      }

      // Tạo đối tượng chứa thông tin của bài viết đã được định dạng lại
      const statusInfo = {
        postId,
        userId,
        userName: userData.name,
        userAvatar: userData.avatar,
        content: statusData.content,
        media: statusData.media,
        date: statusData.date,
        formattedDate: formattedDate,
        likeCount: likedUsers.length,
        commentCount: commentedUsers.length,
        likedUsers, //Chỉ để mục đích kiểm tra người dùng này đã like tus chưa
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
