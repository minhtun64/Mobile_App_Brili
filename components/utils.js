import moment from "moment";
import { onValue, ref, push, set, get } from 'firebase/database';
import { database } from "../firebase";
import {
  useEffect,
  useState,
  React
} from "react";
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
          sender: (sender),
          receiver: (receiver),
          type,
          postid: (postID),
          seen: 0,
          datetime
        };     
        console.log(notiData);
        set(notiNewRef, notiData);
      })
   }
  });
};


export const saveNotificationFollow = (sender, type, receiver) => {
  const notiRef = ref(database, `notification`);
    get(notiRef).then((snapshot) => {
    const data = snapshot.val();
    const listNoti = Object.keys(data);
    let maxNotiId = 0;
    if(listNoti.length > 0){
      maxNotiId = Math.max(...listNoti)+1;
      const notiNewRef = ref(database, `notification/${maxNotiId}`);
     
        const datetime = moment().format("DD-MM-YYYY HH:mm:ss"); // Lấy thời gian hiện tại
        const notiData = {
          sender: parseInt(sender),
          receiver: parseInt(receiver),
          type,
          postid:0,
          seen: 0,
          datetime
        };     
        console.log(notiData);
        set(notiNewRef, notiData); 
   }
  });
};

export const getCountSeenNoti = (userId) => {
  const notiRef = ref(database, 'notification');
  let seenCount = 0; // Sử dụng biến khác để lưu giá trị seenCount
  onValue(notiRef, (snapshot) => {
    const notisData = snapshot.val();
    if (notisData) {
      const notis = Object.entries(notisData).map(([notiID, noti]) => {
        if (noti.receiver === userId) {
          return { notiID, ...noti };
        }
      }).filter(noti => noti); // Lọc bỏ các giá trị undefined
      seenCount = notis.filter(noti => noti.seen === 0).length;
    }
  });
  return seenCount; // Trả về giá trị của seenCount
};



