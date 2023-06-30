import moment from "moment";
import { onValue, ref, push, set, get } from 'firebase/database';
import { database } from "../firebase";

export const formatDate = (date) => {
  const postDate = moment(date, "DD-MM-YYYY HH:mm:ss");
  const currentDate = moment();
  const duration = moment.duration(currentDate.diff(postDate));
  const minutes = duration.asMinutes();
  const hours = duration.asHours();
  const days = duration.asDays();

  let formattedDate = "";
  if (minutes < 1) {
    formattedDate = "Vừa xong";
  } else if (hours < 1) {
    formattedDate = `${Math.floor(minutes)} phút trước`;
  } else if (days < 1) {
    formattedDate = `${Math.floor(hours)} giờ trước`;
  } else if (days < 7) {
    formattedDate = `${Math.floor(days)} ngày trước`;
  } else {
    formattedDate = postDate.format("DD-MM-YYYY");
  }

  return formattedDate;
};

//lưu thông báo vào database
export const saveNotification = (sender, type, postID) => {
  const notiRef = ref(database, `notification`);
    get(notiRef).then((snapshot) => {
    const data = snapshot.val();
    const listNoti = Object.keys(data);
    let maxNotiId = 0;
    if(listNoti.length > 0){
      maxNotiId = Math.max(...listNoti)+1;
      const notiNewRef = ref(database, `notification/${maxNotiId}`);
      const notiReceiverRef = ref(database, `post/${postID}/user_id`);
      onValue(notiReceiverRef, (snapshot) => {
        const receiver = snapshot.val()
        console.log(receiver)
        const datetime = moment().format("DD-MM-YYYY HH:mm:ss"); // Lấy thời gian hiện tại
        const notiData = {
          sender: parseInt(sender),
          receiver: parseInt(receiver),
          type,
          postid: parseInt(postID),
          seen: 0,
          datetime
        };     
        console.log(notiData);
        set(notiNewRef, notiData);
      })


   }
  });

  

};
