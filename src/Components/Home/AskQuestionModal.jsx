import React, { useState, useRef, useEffect } from 'react';
import '../../styles/homepage.css';


const AskQuestionModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const response = await fetch("https://formspree.io/f/meoayqbd", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setSubmitted(true);
        formRef.current.reset();
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    } catch {
      alert("❌ Failed to submit. Please check your connection.");
    }
  };

  if (!isOpen) return null;

 return (
  <div className={`modal${isOpen ? ' open' : ''}`} onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <span className="close" onClick={onClose}>&times;</span>
      <h3>Submit Your Question</h3>
      {!submitted ? (
        <form ref={formRef} onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="question" rows="5" placeholder="Your Question" required></textarea>
          <button type="submit">Send Question</button>
        </form>
      ) : (
        <div style={{ marginTop: '1rem', color: 'green' }}>
          ✅ Your question has been submitted. JazakAllah Khair!
        </div>
      )}
    </div>
  </div>
);
};

export default AskQuestionModal;
