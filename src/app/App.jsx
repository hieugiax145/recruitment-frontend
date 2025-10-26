import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import "./App.css";
import { ToastContainer } from "react-toastify";
import GlobalLoadingIndicator from "../components/GlobalLoadingIndicator.jsx";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
      <GlobalLoadingIndicator />
    </div>
  );
}

export default App;
