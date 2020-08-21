import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { WeatherSymbol } from "@yr/weather-symbols";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import iconList from "./iconList.json";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    justifyItems: "center",
  },
  weatherContent: {
    padding: "30px",
    justifyContent: "center",
    alignItems: "center",
  },
  componentPadding: {
    paddingRight: "20px",
    paddingLeft: "30px",
  },
  weatherInfogrid: {
    textAlign: "left",
  },
});

function Weather() {
  const classes = useStyles();

  const [data, setData] = useState(null);
  const lat = "59.919159";
  const lon = "10.764486";

  const newdate = moment().startOf("hour");

  useEffect(() => {
    axios
      .get(
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`
      )
      .then((response) => {
        setData(response.data);
      });
  }, [lat, lon]);

  if (!data) {
    return "loading...";
  }

  const weather = data.properties.timeseries.find((item) => {
    return moment(item.time).isSame(newdate);
  });

  const icon = weather?.data?.next_1_hours?.summary?.symbol_code;
  const icons = iconList;
  const values = Object.values(icons);
  const keys = Object.keys(icons);

  function getIcon() {
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === icon) {
        return values[i];
      }
    }
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container className={classes.weatherContent}>
          <WeatherSymbol id={getIcon()} type="img" rootImagePath="/png/48/" />
          <Typography
            className={classes.componentPadding}
            style={{ fontWeight: 600 }}
            variant="h3"
          >
            {Math.round(weather?.data?.instant?.details?.air_temperature) +
              "°" ?? "-"}
          </Typography>
          <Grid className={classes.weatherInfogrid}>
            <Typography>
              {weather?.data?.next_1_hours?.details?.precipitation_amount +
                " mm" ?? "-"}
            </Typography>
            <Typography>
              {weather?.data?.instant?.details?.wind_speed + " m/s" ?? "-"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Weather;
