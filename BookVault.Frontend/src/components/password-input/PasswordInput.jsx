import React, { useState } from 'react';
import { IoEyeOff, IoEye } from 'react-icons/io5';
import styles from './passwordinput.module.css';

export default function PasswordInput({ name, value, style,  onChange, placeholder, required = false, className }) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible((prev) => !prev);

  return (
    <div className={styles.inputContainer}>
      <div className={styles.passwordWrapper} style={style}>
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={className}
          required={required}
        />
        <span className={styles.toggleIcon} onClick={toggleVisibility}>
          {visible ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </span>
      </div>
    </div>
  );
}
