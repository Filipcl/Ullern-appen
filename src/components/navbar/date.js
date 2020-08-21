import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";

export default function ShowDate() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    var timerID = setInterval(() => tick(), 3600000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  function getDate() {
    const formattedDate = moment(date).format("dddd DD MMM");
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return (
    <Typography variant="h3" style={{ fontWeight: 600, color: "#FFF" }}>
      {getDate()}
    </Typography>
  );
}
