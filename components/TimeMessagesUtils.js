import moment from "moment";

export const formatTime = (date) => {
    const sendTime = moment(date, "DD-MM-YYYY HH:mm:ss");
    const currentTime = moment();
    const duration = moment.duration(currentTime.diff(sendTime));
    const seconds = duration.asSeconds();
    const minutes = duration.asMinutes();
    const hours = duration.asHours();
    const days = duration.asDays();

    let formattedTime = "";
    if (seconds < 60) {
        formattedTime = `${Math.floor(seconds)} giây trước`;
    } else if (minutes < 60) {
        formattedTime = `${Math.floor(minutes)} phút trước`;
    } else if (hours < 24) {
        formattedTime = `${Math.floor(hours)} giờ trước`;
    } else if (days < 30) {
        formattedTime = `${Math.floor(days)} ngày trước`;
    } else {
        formattedTime = sendTime.format("DD/MM/YYYY");
    }

    return formattedTime;
};
