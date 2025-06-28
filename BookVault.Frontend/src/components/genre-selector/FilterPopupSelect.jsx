import React, { useState, useRef, useEffect } from "react";
import styles from "./filterpopupselect.module.css";
import { IoChevronDown, IoCloseCircle } from "react-icons/io5";

export default function FilterPopupSelect({ options, selectedValue, onSelect, placeholder = "Select", twoColumns = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect("");
  };

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label;

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={() => setIsOpen(prev => !prev)}>
        <span>{selectedLabel || placeholder}</span>
        <span className={styles.iconWrapper}>
          {selectedValue ? (
            <IoCloseCircle
            size={20}
              className={styles.closeIcon}
              onClick={handleClear}
              title="Clear selection"
            />
          ) : (
            <IoChevronDown className={styles.arrowIcon} />
          )}
        </span>
      </button>

      {isOpen && (
        <div className={styles.modal} ref={modalRef}>
          <div className={twoColumns ? styles.optionsGrid : styles.optionsList}>
            {options.map(({ label, value }) => (
              <div
                key={value}
                className={`${styles.option} ${value === selectedValue ? styles.selected : ""}`}
                onClick={() => handleSelect(value)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

