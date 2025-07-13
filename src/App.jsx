import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library from './Pages/library/library';
import LibraryAr from './Pages/library/library_ar';
import EngBooksPage from "./Pages/library/libraryBooks";
import ArabicBooksPage from "./Pages/library/libraryBooks_ar";
import Home from './Pages/Home';
import HomeArabic from './Pages/HomeArabic';
import ReadBookPage from "./Pages/library/readBook";
import BookDetails from './Components/library/BookDetails';
import QuestionPageArabic from './Pages/QuestionPageArabic';
import QuestionPageEnglish from './Pages/QuestionPageEnglish';
import AboutArabic from './Pages/About/AboutArabic';
import AboutEnglish from './Pages/About/AboutEnglish';


import './App.css';

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ar" element={<HomeArabic />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library_ar" element={<LibraryAr />} />
          <Route path="/library/engbooks" element={<EngBooksPage />} />
          <Route path="/library/arabicbooks" element={<ArabicBooksPage />} />
          <Route path="/library/read/:lang/:slug" element={<ReadBookPage />} />
          <Route path="/books/:lang/:slug" element={<BookDetails />} />


          <Route path="/questions/:slug" element={<QuestionPageEnglish />} />
          <Route path="/ar/questions/:slug" element={<QuestionPageArabic />} />

           <Route path="/about-us" element={<AboutEnglish />} />
           <Route path="/about-us/ar" element={<AboutArabic />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
