// App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import AdminPageHandler from "./pages/admin/AdminPageHandler";
import HomePage from "./pages/home/Home";
import AboutPage from "./pages/about/AboutPage";

ReactGA.initialize(process.env.REACT_APP_GA4_MEASUREMENT_ID);

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
}

const ADMIN_ROUTE = process.env.REACT_APP_ADMIN_ROUTE;

function App() {
  usePageTracking();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={`/${ADMIN_ROUTE}`} element={<AdminPageHandler action={undefined} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
