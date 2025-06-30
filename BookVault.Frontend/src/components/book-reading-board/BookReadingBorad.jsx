import React from 'react';
import styles from './bookreadingborad.module.css';
import { useParams } from 'react-router-dom';

export default function BookReadingBorad() {
  const { id } = useParams();

  return (
    <div className={styles.container}>BookReadingBorad - { id } </div>
  )
}
