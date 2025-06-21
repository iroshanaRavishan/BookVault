import React, { useState } from 'react';
import styles from './faqpage.module.css';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I contact support?",
      answer: "You can contact our support team using the contact form on this page or email us directly at support@example.com."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.faqCard}>
        <div className={styles.faqHeader}>
          <h2 className={styles.pageTitle}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>Find answers to common questions below</p>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className={styles.arrow}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
