import React from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";

// Fackbackend
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Flash Notification System
import FlashContainer from "./Components/Common/FlashNotification/FlashContainer";

// Activating fake backend
fakeBackend();

function App() {
  return (
    <React.Fragment>
      <Route />
      <FlashContainer />
    </React.Fragment>
  );
}

export default App;