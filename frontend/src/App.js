import AdminPageHandler from './pages/admin/AdminPageHandler';
import HomePage from './pages/home/Home';
import { ADMIN_ROUTE } from './Config';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path={`/${ADMIN_ROUTE}`} element={<AdminPageHandler action={ undefined }/>} />
      </Routes>
    </Router>
  );
}

export default App;