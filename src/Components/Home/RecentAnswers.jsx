import React, { useEffect, useState } from 'react';
import QuestionItem from './QuestionItem';
import Pagination from './Pagination';
import { useNavigate } from "react-router-dom";


const RecentAnswers = ({
  fetchFatwas,
  sectionTitle = 'Recent Answers',
  searchPlaceholder = 'Search...',
  questionLabel = 'Q',
  direction = 'ltr',
}) => {
  const [fatwas, setFatwas] = useState([]);
  const [filteredFatwas, setFilteredFatwas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadFatwas = async () => {
      try {
        const data = await fetchFatwas();
        const reversed = data.slice().reverse();
        setFatwas(reversed);
        setFilteredFatwas(reversed);
      } catch (error) {
        console.error('Failed to load fatwas:', error);
        setFatwas([]);
        setFilteredFatwas([]);
      }
    };

    loadFatwas();
  }, [fetchFatwas]);

  //const handleSearch = (e) => {
    //const query = e.target.value.toLowerCase();
    //const results = fatwas.filter(fatwa =>
      //fatwa.heading.toLowerCase().includes(query)
   // );
    //setFilteredFatwas(results);
   // setCurrentPage(1);
 // };
 const navigate = useNavigate();

const handleSearch = (e) => {
  if (e.key === "Enter") {
    const query = e.target.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      e.target.value = ""; // optional clear
    }
  }
};


  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFatwas = filteredFatwas.slice(startIndex, startIndex + itemsPerPage);

  const isRTL = direction === 'rtl';

  return (
    <section aria-labelledby="recent-answers" dir={direction}>
      <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
        <h3 id="recent-answers" style={{ margin: 0}}>{sectionTitle}</h3>
        <span
          id="answerCount"
          style={{ fontSize: '0.95rem', display: 'block', marginTop: '0.5rem' }}
        >
          {isRTL ? 'عدد الإجابات:' : 'Total Answers:'} {filteredFatwas.length}
        </span>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <input
          type="text"
          id="fatwaSearch"
          placeholder={searchPlaceholder}
           onKeyDown={handleSearch}  
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '1rem',
            direction: direction,
            textAlign: isRTL ? 'right' : 'left',
          }}
        />
      </div>

      <div id="fatwaList">
        {paginatedFatwas.length > 0 ? (
          paginatedFatwas.map((item, index) => (
            <QuestionItem
              key={index}
              index={startIndex + index}
              item={item}
              labelPrefix={questionLabel}
              direction={direction} // ✅ Pass direction to each item
            />
          ))
        ) : (
          <p style={{ color: 'red', textAlign: isRTL ? 'right' : 'left' }}>
            {/* {isRTL ? '❌ لم يتم العثور على أسئلة.' : '❌ No questions found.'} */}
          </p>
        )}
      </div>

      <Pagination
        totalItems={filteredFatwas.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default RecentAnswers;
