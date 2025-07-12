import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homepage.css';


const QuestionItem = ({ item, index }) => {
  return (
    <Link
      to={`/questions/${item.slug}`}
      className="question-item"
      style={{
        display: 'block',
        marginTop: '1.5rem',
        padding: '1rem',
        borderLeft: '5px solid var(--primary-color)',
        backgroundColor: 'var(--accent-bg)',
        borderRadius: '5px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background-color 0.2s',
      }}
    >
      <strong>Q{index + 1}:</strong> {item.heading}
    </Link>
  );
};

export default QuestionItem;
