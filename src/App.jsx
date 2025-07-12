import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Library from './pages/library/library';
import LibraryAr from './pages/library/library_ar';
import EngBooksPage from "./pages/library/libraryBooks";
import ArabicBooksPage from "./pages/library/libraryBooks_ar";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/library" element={<Library />} />
        <Route path="/library_ar" element={<LibraryAr />} />
        <Route path="/library/engbooks" element={<EngBooksPage />} />
  <Route path="/library/arabicbooks" element={<ArabicBooksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
