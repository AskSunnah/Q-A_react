import React, { useState } from 'react';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 0,
    section: '',
    feedback: ''
  });
  const [submitted, setSubmitted] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault(); // important if you're using <form> tag

  // Basic validation
  if (!formData.name || !formData.email || !formData.rating || !formData.section || !formData.feedback) {
    alert('Please fill in all required fields');
    return;
  }

  setSubmitting(true);
  setError(null);

  try {
    const res = await fetch('https://formspree.io/f/mrbwreqj', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        rating: formData.rating,
        section: formData.section,
        feedback: formData.feedback,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      // Optional: log
      console.log('Form submitted to Formspree:', formData);

      // Reset form after a few seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          rating: 0,
          section: '',
          feedback: ''
        });
        setSubmitted(false);
      }, 3000);
    } else {
      const data = await res.json().catch(() => null);
      console.error('Formspree error:', data);
      setError('Something went wrong sending your feedback. Please try again.');
    }
  } catch (err) {
    console.error('Network error:', err);
    setError('Network error. Please check your connection and try again.');
  } finally {
    setSubmitting(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRating = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background:'white',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'var(--bg-light)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px'
          }}>
            We Value Your Feedback
          </h1>
          <p style={{ color: '#718096', fontSize: '15px' }}>
            Help us improve AskSunnah for everyone
          </p>
        </div>

        {submitted ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>✓</div>
            <h2 style={{
              fontSize: '24px',
              color: '#10b981',
              marginBottom: '8px'
            }}>Thank You!</h2>
            <p style={{ color: '#718096' }}>Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
          <div>
            {/* Name */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Phone Number <span style={{ color: '#9ca3af', fontWeight: '400' }}>(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Rating */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                1. How was your experience? *
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                  type='button'
                    key={star}
                    onClick={() => handleRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '40px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {star <= (formData.rating) ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            {/* Section */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}>
                2. What part of AskSunnah were you using? *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Q&A', 'Books', 'Search / Library', 'Other'].map((option) => (
                  <label
                    key={option}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 16px',
                      border: '2px solid',
                      borderColor: formData.section === option ? '#667eea' : '#e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: formData.section === option ? '#f3f4f6' : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      name="section"
                      value={option}
                      checked={formData.section === option}
                      onChange={handleInputChange}
                      style={{
                        marginRight: '12px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '15px', color: '#374151' }}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                3. What went wrong or what should we improve? *
              </label>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '12px'
              }}>
                Tell us briefly about your experience
              </p>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows="5"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="Share your thoughts, suggestions, or issues you encountered..."
              />
            </div>

            {/* Submit Button */}
            <button
            type='submit'
            disabled={submitting}
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
               {submitting ? 'Sending…' : 'Submit Feedback'}
            </button>
          </div></form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
