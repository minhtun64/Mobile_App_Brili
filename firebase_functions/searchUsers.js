import { database } from "../firebase";
import { ref, get } from "firebase/database";

const searchUsers = async (myUserId, textInput) => {
  let users = [];

  const usersRef = ref(database, "user");
  let usersSnapshot = await get(usersRef);
  if (usersSnapshot.exists()) {
    usersSnapshot.forEach((childSnapshot) => {
      let userData = childSnapshot.val();
      if (
        userData.name.toLowerCase().includes(textInput.toLowerCase()) &&
        userData.role == 1
      ) {
        users.push({
          userId: childSnapshot.key,
          userName: userData.name,
          userAvatar: userData.avatar,
          userIntro: userData.intro,
          isFollowing: false,
        });
      }
    });
  }

  const followedUserRef = ref(database, `follow/${myUserId}`);
  const followedUserSnapshot = await get(followedUserRef);

  // Cập nhật giá trị isFollowing cho từng người trong danh sách searchedUsers
  const updatedUsers = users.map((user) => {
    if (user.userId === myUserId) {
      // Nếu người dùng trong danh sách là người hiện tại (tôi)
      return {
        ...user,
        isFollowing: "true", // Đánh dấu là tôi đang theo dõi chính mình
      };
    } else if (
      followedUserSnapshot.exists() &&
      followedUserSnapshot.child(user.userId).exists()
    ) {
      // Nếu người dùng trong danh sách được theo dõi bởi tôi
      return {
        ...user,
        isFollowing: "true",
      };
    } else {
      // Nếu người dùng trong danh sách không được theo dõi bởi tôi
      return user;
    }
  });

  let sortedUsers = [...updatedUsers];
  sortedUsers.sort((a, b) => {
    // Sắp xếp theo yêu cầu của bạn
    if (a.userId === myUserId) {
      return -1; // Đưa tôi lên đầu danh sách
    } else if (b.userId === myUserId) {
      return 1;
    } else if (a.isFollowing && !b.isFollowing) {
      return -1; // Đưa những người tôi đang theo dõi lên trước
    } else if (!a.isFollowing && b.isFollowing) {
      return 1;
    } else {
      return 0;
    }
  });

  return sortedUsers;
};

export default searchUsers;
