import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CityBikeLogo from "../../assets/img/oslo_bysykkel_logo.svg";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  bikeInfo: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  avaliableBikes: {
    paddingLeft: 20,
  },
});

function Citybike() {
  const classes = useStyles();

  const [data, setData] = useState(null);
  const stationId = "627";

  useEffect(() => {
    axios
      .get(
        "https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json",
        { headers: { "Client-Identifier": "Nettbureau-dashboard" } }
      )
      .then((response) => {
        setData(response.data.data);
      });
  }, []);

  if (!data) {
    return "loading...";
  }

  const station = data.stations.find((item) => {
    return item.station_id === stationId;
  });

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" color="textSecondary">
          Skøyen Stasjon
        </Typography>
        <div className={classes.bikeInfo}>
          <img
            src={CityBikeLogo}
            style={{ height: 45, width: 30 }}
            alt="Nettbureau"
          />
          <Typography
            style={{ fontWeight: 600 }}
            variant="h4"
            className={classes.avaliableBikes}
          >
            {station.num_bikes_available +
              "/" +
              (station.num_docks_available + station.num_bikes_available)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default Citybike;
