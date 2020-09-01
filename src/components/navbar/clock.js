import React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import { Typography } from "@material-ui/core";

export default function Clock() {
  const [time, setDate] = useState(new Date());

  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <Typography variant="h4" style={{ fontWeight: 600, color: "#FFF" }}>
      {moment(time.getTime()).format("HH:mm")}
    </Typography>
  );
}
