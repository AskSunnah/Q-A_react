
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//library imports
import Library from './Pages/library/library';
import LibraryAr from './Pages/library/library_ar';
import EngBooksPage from "./Pages/library/libraryBooks";
import ArabicBooksPage from "./Pages/library/libraryBooks_ar";
import ReadBookPage from "./Pages/library/readBook";
import BookDetails from './Components/library/BookDetails';
//home imports
import HomeArabic from './Pages/Home/HomeArabic';
import Home from './Pages/Home/Home';
import QuestionPageArabic from './Pages/Home/QuestionPageArabic';
import QuestionPageEnglish from './Pages/Home/QuestionPageEnglish';
import AboutArabic from './Pages/About/AboutArabic';
import AboutEnglish from './Pages/About/AboutEnglish';
//admin imports
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProtectedRoute from './Components/Admin/ProtectedRoute';
import AddQA from './Pages/Admin/AddQA';
import AllQA from './Pages/Admin/AllQA';
import AddBook from './Pages/Admin/AddBook';
import AllBooks from './Pages/Admin/AllBooks';
import EditBook from './Pages/Admin/EditBook';
//payment imports
import ManageSubscription from './Pages/ManageSubscription';
import Success from './Pages/Success';
import Cancel from './Pages/Cancel';
//shared
import ContributePage from './Pages/Contribute';
import ContributePageAr from './Pages/ContributeArabic';
import ChatbaseLoader from "./Components/ChatbaseLoader";
import FeedbackFormPage from './Pages/FeedbackFormPage';
import FeedbackFormArabicPage from './Pages/FeedbackFormPageArabic';
import './App.css';
function App() {
  return (
    <Router>
      <div>
<ChatbaseLoader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ar" element={<HomeArabic />} />
          <Route path="/questions/:slug" element={<QuestionPageEnglish />} />
          <Route path="/ar/questions/:slug" element={<QuestionPageArabic />} />
          <Route path="/about-us" element={<AboutEnglish />} />
          <Route path="/about-us/ar" element={<AboutArabic />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library_ar" element={<LibraryAr />} />
          <Route path="/library/engbooks" element={<EngBooksPage />} />
          <Route path="/library/arabicbooks" element={<ArabicBooksPage />} />
          <Route path="/library/read/:lang/:slug" element={<ReadBookPage />} />
          <Route path="/books/:lang/:slug" element={<BookDetails />} />
          <Route path="/supervised" element={<AdminLogin />} />
          <Route path="/supervised/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/supervised/add-qa" element={
            <ProtectedRoute><AddQA /></ProtectedRoute>
          } />
          <Route path="/supervised/all-qa" element={
            <ProtectedRoute><AllQA /></ProtectedRoute>
          } />
          <Route path="/supervised/add-book" element={
            <ProtectedRoute><AddBook /></ProtectedRoute>
          } />
          <Route path="/supervised/all-books" element={
            <ProtectedRoute><AllBooks /></ProtectedRoute>
          } />
          <Route path="/supervised/books/edit/:lang/:slug" element={
            <ProtectedRoute><EditBook /></ProtectedRoute>
          } />
        <Route path="/managesubscription" element={<ManageSubscription />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path = "/feedback" element={<FeedbackFormPage />}/>
        <Route path = "/feedback-ar" element={<FeedbackFormArabicPage />}/>
          <Route path="/contribute" element={<ContributePage  />} />
          <Route path="/ar/contribute" element={<ContributePageAr />} />

        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
