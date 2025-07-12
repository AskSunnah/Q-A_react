import React, { useEffect, useState } from 'react';
import QuestionItem from './QuestionItem';
import Pagination from './Pagination';
import { fetchAllFatwas } from '../../api/fatwa';
import '../../styles/homepage.css';


const RecentAnswers = () => {
  const [fatwas, setFatwas] = useState([]);
  const [filteredFatwas, setFilteredFatwas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadFatwas = async () => {
      try {
        const data = await fetchAllFatwas();
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
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const results = fatwas.filter(fatwa =>
      fatwa.heading.toLowerCase().includes(query)
    );
    setFilteredFatwas(results);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFatwas = filteredFatwas.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section aria-labelledby="recent-answers">
      <div>
        <h3 id="recent-answers" style={{ margin: 0 }}>Recent Answers</h3>
        <span id="answerCount" style={{ fontSize: '0.95rem', display: 'block', marginTop: '0.5rem' }}>
          Total Answers: {filteredFatwas.length}
        </span>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <input
          type="text"
          id="fatwaSearch"
          placeholder="Search..."
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '1rem',
          }}
        />
      </div>

      <div id="fatwaList">
        {paginatedFatwas.length > 0 ? (
          paginatedFatwas.map((item, index) => (
            <QuestionItem key={index} index={startIndex + index} item={item} />
          ))
        ) : (
          <p style={{ color: 'red' }}>❌ No questions found.</p>
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
