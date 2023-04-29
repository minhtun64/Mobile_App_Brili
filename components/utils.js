import moment from "moment";

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
