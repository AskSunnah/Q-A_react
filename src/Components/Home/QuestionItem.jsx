import { Link } from 'react-router-dom';
import '../../styles/homepage.css';


const QuestionItem = ({ item, index, labelPrefix = 'Q', direction = 'ltr' }) => {
  const isRTL = direction === 'rtl';

  return (
    <Link
      to={`/${isRTL ? 'ar/' : ''}questions/${item.slug}`}
      className="question-item"
      style={{
        display: 'block',
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--accent-bg)',
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
  );
};

export default QuestionItem;  