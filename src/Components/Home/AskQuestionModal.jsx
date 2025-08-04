import React, { useState, useRef, useEffect } from 'react';

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

    <>
    <style>
      {`
    .modal {
      display: none;
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .modal.open {
      display: block;
    }

    .modal-content {
      background-color: var( --bg-main);
      margin: 10% auto;
      padding: 2rem;
      border: 1px solid #888;
      width: 90%;
      max-width: 500px;
      border-radius: 10px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    .modal-content h3 {
      margin-bottom: 1rem;
      color: var(--text-accent);
    }

    .modal-content input,
    .modal-content textarea {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-family: var(--font-family);
    }

    .modal-content button {
      padding: 0.75rem 1.25rem;
      background-color: var(--bg-color-header);
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .modal-content button:hover {
      background-color: #a88c1e;
    }

    .close {
      color: #aaa;
      float: right;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
    }

    [dir="rtl"] .close {
      float: left;
    }

    [dir="rtl"] .modal-content,
    [dir="rtl"] .modal-content h3 {
      text-align: right;
    }`}
    </style>
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
    </>
  );
};

export default AskQuestionModal;
