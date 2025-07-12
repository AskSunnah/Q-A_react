import React, { useState, useRef, useEffect } from 'react';
import '../../styles/homepage.css';

const AskQuestionModal = ({
  isOpen = false,
  onClose = () => {},
  formAction = 'https://formspree.io/f/meoayqbd',
  language = 'en',
  direction = 'ltr',
  placeholders = {
    name: 'Your Name',
    email: 'Your Email',
    question: 'Your Question',
  },
  labels = {
    title: 'Submit Your Question',
    submit: 'Send Question',
    success: '✅ Your question has been submitted. JazakAllah Khair!',
    error: '❌ Something went wrong. Please try again.',
    connectionError: '❌ Failed to submit. Please check your connection.',
    close: 'Close',
  },
}) => {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (isOpen) setSubmitted(false);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const response = await fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setSubmitted(true);
        formRef.current.reset();
      } else {
        alert(labels.error);
      }
    } catch {
      alert(labels.connectionError);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal${isOpen ? ' open' : ''}`} onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        dir={direction}
        lang={language}
      >
        <span className="close" onClick={onClose} role="button" aria-label={labels.close}>
          &times;
        </span>
        <h3>{labels.title}</h3>
        {!submitted ? (
          <form ref={formRef} onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder={placeholders.name} required />
            <input type="email" name="email" placeholder={placeholders.email} required />
            <textarea name="question" rows="5" placeholder={placeholders.question} required></textarea>
            <button type="submit">{labels.submit}</button>
          </form>
        ) : (
          <div style={{ marginTop: '1rem', color: 'green' }}>{labels.success}</div>
        )}
      </div>
    </div>
  );
};

export default AskQuestionModal;
