import { database } from "../firebase";
import { ref, get } from "firebase/database";
import { formatDate } from "../components/utils";

const getStatusDetailInfo = async (postId) => {
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
            const likeData = userLikes[commentId];
            const likeUserRef = ref(database, `user/${userId}`);
            const likeUserSnapshot = await get(likeUserRef);
            const likeUserData = likeUserSnapshot.val();
            likedUsers.push({
              userId: userId,
              userName: likeUserData.name,
              userAvatar: likeUserData.avatar,
              userIntro: likeUserData.intro,
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
        if (comment.post_id === postId) {
          const commentUserId = comment.user_id;
          const commentUserRef = ref(database, `user/${commentUserId}`);
          const commentUserSnapshot = await get(commentUserRef);
          const commentUserData = commentUserSnapshot.val();

          const commentLikesSnapshot = await get(
            ref(database, `like/${postId}/${commentUserId}/${commentKey}`)
          );
          const commentLikesData = commentLikesSnapshot.val();
          const commentLikeCount = Object.keys(commentLikesData || {}).length;

          //Lấy danh sách những người đã like bình luận
          const commentLikedUsers = [];
          for (const userId in commentLikesData) {
            const userLikes = commentLikesData[userId];
            for (const commentId in userLikes) {
              const likeData = userLikes[commentId];
              const likeUserRef = ref(database, `user/${userId}`);
              const likeUserSnapshot = await get(likeUserRef);
              const likeUserData = likeUserSnapshot.val();
              commentLikedUsers.push({
                userId: userId,
                userName: likeUserData.name,
                userAvatar: likeUserData.avatar,
                userIntro: likeUserData.intro,
              });
            }
          }

          const formattedCommentDate = formatDate(comment.date);

          commentedUsers.push({
            commentId: commentKey,
            userId: commentUserId,
            userName: commentUserData.name,
            userAvatar: commentUserData.avatar,
            content: comment.content,
            media: comment.media,
            likeCount: commentLikeCount,
            date: comment.date,
            formattedDate: formattedCommentDate,
            likedUsers: commentLikedUsers,
          });
        }
      }

      // Sắp xếp các bình luận từ cũ nhất tới mới nhất dựa trên date
      commentedUsers.sort((a, b) => {
        const aDateParts = a.date.split(" ");
        const aDate =
          aDateParts[0].split("-").reverse().join("-") + " " + aDateParts[1];
        const bDateParts = b.date.split(" ");
        const bDate =
          bDateParts[0].split("-").reverse().join("-") + " " + bDateParts[1];
        return new Date(aDate) - new Date(bDate);
      });

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
        likedUsers,
        commentedUsers,
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

export default getStatusDetailInfo;
