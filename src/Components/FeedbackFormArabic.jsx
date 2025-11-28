import React, { useState } from 'react';

export default function FeedbackFormArabic() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.rating || !formData.section || !formData.feedback) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('https://your-backend-url.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        console.error(data);
        alert(data.error || 'حدث خطأ أثناء إرسال الملاحظة. حاول مرة أخرى.');
        return;
      }

      setSubmitted(true);

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
    } catch (err) {
      console.error(err);
      alert('خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
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

  // Arabic labels but English values for backend enum
  const sections = [
    { value: 'Q&A', label: 'قسم الأسئلة والأجوبة' },
    { value: 'Books', label: 'قسم الكتب' },
    { value: 'Search / Library', label: 'البحث / المكتبة' },
    { value: 'Other', label: 'أخرى' },
  ];

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: 'white',
        padding: '40px 20px',
        fontFamily:
          '"Tajawal", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'var(--bg-light)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px'
            }}
          >
            نُقدِّر رأيك في AskSunnah
          </h1>
          <p style={{ color: '#718096', fontSize: '15px' }}>
            ساعدنا على تحسين المنصة لجميع المستخدمين
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              animation: 'fadeIn 0.5s ease-in'
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: '24px',
                color: '#10b981',
                marginBottom: '8px'
              }}
            >
              شكرًا لك!
            </h2>
            <p style={{ color: '#718096' }}>
              تم إرسال ملاحظتك بنجاح.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                الاسم الكريم *
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
                  boxSizing: 'border-box',
                  textAlign: 'right'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                placeholder="اكتب اسمك هنا"
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                البريد الإلكتروني *
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
                  boxSizing: 'border-box',
                  textAlign: 'right'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                رقم الجوال{' '}
                <span
                  style={{ color: '#9ca3af', fontWeight: '400' }}
                >
                  (اختياري)
                </span>
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
                  boxSizing: 'border-box',
                  textAlign: 'right'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                placeholder="+966 5x xxx xxxx"
              />
            </div>

            {/* Rating */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                ١. كيف تُقيِّم تجربتك مع AskSunnah؟ *
              </label>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '8px'
                }}
              >
                ١ نجمة = سيئة جدًا ، ٥ نجوم = ممتازة
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '12px',
                  justifyContent: 'flex-start'
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '40px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {star <= formData.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            {/* Section */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px'
                }}
              >
                ٢. أي جزء من AskSunnah كنتَ تستخدم؟ *
              </label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {sections.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 16px',
                      border: '2px solid',
                      borderColor:
                        formData.section === option.value
                          ? '#667eea'
                          : '#e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background:
                        formData.section === option.value
                          ? '#f3f4f6'
                          : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      name="section"
                      value={option.value}
                      checked={formData.section === option.value}
                      onChange={handleInputChange}
                      style={{
                        marginLeft: '12px',
                        marginRight: 0,
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span
                      style={{ fontSize: '15px', color: '#374151' }}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                ٣. ما المشكلة التي واجهتها أو ماذا تقترح لتحسين المنصة؟ *
              </label>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '12px'
                }}
              >
                اكتب لنا بإيجاز رأيك أو ملاحظاتك أو أي صعوبات واجهتها
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
                  boxSizing: 'border-box',
                  textAlign: 'right'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                placeholder="اكتب ملاحظاتك أو اقتراحاتك هنا..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px',
                background: submitting
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (submitting) return;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
              {submitting ? 'جاري الإرسال…' : 'إرسال الملاحظة'}
            </button>
          </form>
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
