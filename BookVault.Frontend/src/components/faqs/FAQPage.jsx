import React, { useState } from 'react';
import styles from './faqpage.module.css';
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I contact support?",
      answer: "You can contact our support team using the contact form on this page or email us directly at support@example.com."
    },
    {
      question: "What services do you offer?",
      answer: "We provide a wide range of services including web development, design, and consulting."
    },
    {
      question: "How long does it take to receive a response?",
      answer: "Typically, we respond within 24-48 hours during business days."
    },
    {
      question: "Can I request a custom solution?",
      answer: "Absolutely! Just fill out the contact form with your requirements, and we’ll get in touch with a tailored proposal."
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
                  <span
                    className={`${styles.arrowIcon} ${openIndex === index ? styles.rotated : ''}`}
                  >
                    <FaAngleUp />
                  </span>
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
