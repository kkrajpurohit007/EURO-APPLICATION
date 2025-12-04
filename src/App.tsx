import React from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";

// Fackbackend
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Activating fake backend
fakeBackend();

function App() {
  return (
    <React.Fragment>
      <Route />
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;