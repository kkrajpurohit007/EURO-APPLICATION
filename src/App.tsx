import React from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";

// Fackbackend
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend
fakeBackend();

function App() {
  return (
    <React.Fragment>
      <Route />
    </React.Fragment>
  );
}

export default App;
