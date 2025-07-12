import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library from './Pages/library/library';
import LibraryAr from './Pages/library/library_ar';
import EngBooksPage from "./Pages/library/libraryBooks";
import ArabicBooksPage from "./Pages/library/libraryBooks_ar";
import Home from './Pages/Home';

import './App.css';

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library_ar" element={<LibraryAr />} />
          <Route path="/library/engbooks" element={<EngBooksPage />} />
          <Route path="/library/arabicbooks" element={<ArabicBooksPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
