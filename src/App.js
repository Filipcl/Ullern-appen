import React from "react";
import "./App.css";
import Scoreboard from "./components/scoreboard/scoreboard";
import Home from "./components/home/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/scoreboard" component={Scoreboard} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
