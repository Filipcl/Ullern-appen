import * as React from "react";
import { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import createEnturService from "@entur/sdk";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import useInterval from "../hooks/useInterval";
import { uuid } from "uuidv4";

const useStyles = makeStyles({
  tableCell: {
    borderColor: "white",
    border: "none",
  },
  lineTableCell: {
    color: "white",
    textAlign: "center",
    padding: 10,
    borderColor: "white",
  },
});

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#235772",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

function createData(id, line, direction, time, transportMode, place) {
  return { id, line, direction, time, transportMode, place };
}

function getCurrentTime() {
  let currentDate = new Date();
  return currentDate.getHours() * 60 + currentDate.getMinutes();
}

function sortList(list) {
  return list.sort((a, b) => {
    if (a.time > b.time) {
      return 1;
    } else {
      return -1;
    }
  });
}
function sortDepartures(data) {
  const walkingTime = {
    "NSR:StopPlace:6460": 4,
    "NSR:StopPlace:6510": 11,
  };

  let departuresSoon = [];
  let departuresLate = [];
  data.forEach((places) => {
    places.departures.forEach((departure) => {
      let id = uuid();
      let line = departure.serviceJourney.journeyPattern.line.publicCode;
      let direction = departure.destinationDisplay.frontText;
      let time = departure.expectedDepartureTime.substr(11, 5);
      let hours = parseInt(departure.expectedDepartureTime.substr(11, 2));
      let minutes = parseInt(departure.expectedDepartureTime.substr(14, 2));
      let time2 = hours * 60 + minutes;
      let diff = time2 - getCurrentTime();
      let transportMode = departure.serviceJourney.transportSubmode;
      let place = departure.quay.name;

      if (
        direction === "Storo-Grefsen st." ||
        direction === "Disen" ||
        direction === "Simensbråten"
      ) {
        if (diff > walkingTime[places.id]) {
          if (diff < 15) {
            departuresSoon.push(
              createData(id, line, direction, diff, transportMode, place)
            );
          } else {
            departuresLate.push(
              createData(id, line, direction, time, transportMode, place)
            );
          }
        }
      }
    });
  });
  let departures = sortList(departuresSoon).concat(sortList(departuresLate));
  return departures.slice(0, 9);
}
async function getDepartures() {
  const service = createEnturService({
    clientName: "Ullern-reiseplanlegger",
  });
  let data = await service.getDeparturesFromStopPlaces(
    ["NSR:StopPlace:6460", "NSR:StopPlace:6510"],
    {
      limit: 15,
      includeCancelledTrips: false,
      includeNonBoarding: false,
      whiteListedLines: ["RUT:Line:13", "RUT:Line:23"],
    }
  );
  return sortDepartures(data);
}
function RuterService() {
  const classes = useStyles();
  const [stops, setStops] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  useInterval(async () => {
    try {
      const stops = await getDepartures();
      setStops(stops);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Failed to fetch ruter-departures.");
    }
  }, 1000 * 10);
  if (errorMessage) {
    return <TableContainer component={Paper}>{errorMessage}</TableContainer>;
  }
  function getTransportColor(transportMode) {
    if (transportMode === "localBus") {
      return "#FF462F";
    }
    if (transportMode === "localTram") {
      return "#0973BE";
    }
  }
  function checkMinutes(time) {
    if (time < 15) {
      return "min";
    }
  }
  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        style={{ width: "101%" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead className={classes.head}>
          <StyledTableRow>
            <StyledTableCell align="center">Linje</StyledTableCell>
            <StyledTableCell align="left">Retning</StyledTableCell>
            <StyledTableCell align="left">Tid</StyledTableCell>
            <StyledTableCell align="left">Holdeplass</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {stops.map((stop) => (
            <StyledTableRow key={stop.id}>
              <StyledTableCell
                className={classes.lineTableCell}
                style={{
                  backgroundColor: getTransportColor(stop.transportMode),
                }}
                align="left"
              >
                {stop.line}
              </StyledTableCell>
              <StyledTableCell className={classes.tableCell} align="left">
                {stop.direction}
              </StyledTableCell>
              <StyledTableCell className={classes.tableCell} align="left">
                {stop.time} {checkMinutes(stop.time)}
              </StyledTableCell>
              <StyledTableCell className={classes.tableCell} align="left">
                {stop.place}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default RuterService;
