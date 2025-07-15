import { Link } from 'react-router-dom';
import React from 'react';

// Inline <style> tag (scoped)
const styles = `
  .question-item {
    display: block;
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: var(--accent-bg);
    border-radius: 5px;
    text-decoration: none;
    color: inherit;
    transition: background-color 0.2s;
  }

  .question-item:hover {
    background-color: #e0f2f1;
  }
`;

const QuestionItem = ({ item, index, labelPrefix = 'Q', direction = 'ltr' }) => {
  const isRTL = direction === 'rtl';

  const dynamicStyle = {
    direction: direction,
    textAlign: isRTL ? 'right' : 'left',
    borderLeft: !isRTL ? '5px solid var(--primary)' : 'none',
    borderRight: isRTL ? '5px solid var(--primary)' : 'none',
  };

  return (
<<<<<<< HEAD
    <Link
      to={`/${isRTL ? 'ar/' : ''}questions/${item.slug}`}
      className="question-item"
      style={{
        display: 'block',
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(#f0f4fa)',
        borderRadius: '5px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background-color 0.2s',
        direction: direction,
        textAlign: isRTL ? 'right' : 'left',
        borderLeft: !isRTL ? '5px solid var(--primary)' : 'none',
        borderRight: isRTL ? '5px solid var(--primary)' : 'none',
      }}
    >
      <strong>{labelPrefix}{index + 1}:</strong> {item.heading}
    </Link>
=======
    <>
      <style>{styles}</style>
      <Link
        to={`/${isRTL ? 'ar/' : ''}questions/${item.slug}`}
        className="question-item"
        style={dynamicStyle}
      >
        <strong>{labelPrefix}{index + 1}:</strong> {item.heading}
      </Link>
    </>
>>>>>>> bf53914a50738a83379b183634007527f95cb2f5
  );
};

export default QuestionItem;
