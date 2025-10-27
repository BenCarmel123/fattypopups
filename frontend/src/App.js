import AdminPageHandler from './pages/admin/AdminPageHandler';
import HomePage from './pages/home/Home';
import AboutPage from './pages/about/AboutPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const ADMIN_ROUTE = process.env.REACT_APP_ADMIN_ROUTE;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={`/${ADMIN_ROUTE}`} element={<AdminPageHandler action={ undefined }/>} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
