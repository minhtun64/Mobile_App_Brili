import { ref, push, set } from 'firebase/database';
import { database } from "../firebase";
import moment from 'moment';

export const saveNotification = (sender, receiver, type, postID) => {
     const notiRef = ref(database, 'notification');
     const newNotiRef = push(notiRef); // Tạo một tham chiếu mới để lưu thông báo
   
     const datetime = moment().format("DD-MM-YYYY HH:mm:ss"); // Lấy thời gian hiện tại
   
     const notiData = {
       sender,
       receiver,
       type,
       postid: postID,
       seen: 0,
       datetime
     };
   
     set(newNotiRef, notiData);
};