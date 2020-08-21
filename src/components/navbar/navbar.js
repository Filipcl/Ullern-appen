import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ShowDate from "./date";
import Clock from "./clock";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#235772",
  },
  paper: {
    padding: theme.spacing(1),
    fontSize: 40,
    textAlign: "center",
    boxShadow: "none",
    backgroundColor: "#235772",
  },
  gridItem: {
    alignSelf: "center",
  },
}));

export default function Navbar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid className={classes.gridContainer} container>
        <Grid item xs className={classes.gridItem}>
          <Paper className={classes.paper}>
            <Clock />
          </Paper>
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <Paper className={classes.paper}>
            <Typography style={{ fontWeight: 600, color: "#FFF" }} variant="h2">
              Ullernfaret 1A
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <Paper className={classes.paper}>
            <ShowDate />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
