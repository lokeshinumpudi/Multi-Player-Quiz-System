import React from "react";
import ReactDOM from "react-dom";
// material default theme
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import App from "./App";


// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();


const AppThemed = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(<AppThemed />, document.getElementById("root"));
