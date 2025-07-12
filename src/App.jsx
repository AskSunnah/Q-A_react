import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library from './Pages/library/library';
import LibraryAr from './Pages/library/library_ar';
import EngBooksPage from "./Pages/library/libraryBooks";
import ArabicBooksPage from "./Pages/library/libraryBooks_ar";
import QuestionPage from './Components/Home/QuestionPage';
import Home from './Pages/Home';
import HomeArabic from './Pages/HomeArabic';

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
          <Route path="/questions/:slug" element={<QuestionPage />} />
          <Route path="/ar" element={<HomeArabic />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
