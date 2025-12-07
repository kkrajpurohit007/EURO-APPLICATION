import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";

const store = configureStore({ reducer: rootReducer, devTools: true });

// Subscribe to store changes and persist auth data to localStorage
store.subscribe(() => {
  try {
    const state = store.getState();

    // Persist login state
    if (state.Login?.user && Object.keys(state.Login.user).length > 0) {
      try {
        localStorage.setItem("authUser", JSON.stringify(state.Login.user));
        sessionStorage.setItem("authUser", JSON.stringify(state.Login.user));
        // Dispatch custom event to notify useProfile hook of storage update
        window.dispatchEvent(new Event("authStorageUpdate"));
      } catch (error) {
        console.error("Failed to persist auth state:", error);
      }
    }

    // Clear storage on logout
    if (state.Login?.isUserLogout) {
      localStorage.removeItem("authUser");
      sessionStorage.removeItem("authUser");
      // Dispatch custom event to notify useProfile hook of storage update
      window.dispatchEvent(new Event("authStorageUpdate"));
    }
  } catch (error) {
    console.error("Error in store subscription:", error);
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
