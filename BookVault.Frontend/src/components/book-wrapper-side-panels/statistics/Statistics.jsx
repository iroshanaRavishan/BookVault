import React from 'react'
import styles from './statistics.module.css'

export default function Statistics() {
  return (
    <div className={styles.panel}>
      <span>Progress: 45%</span><br />
      <span>Total Time Spent : 5D : 3H : 23m </span><br />
      <span>Time Spent on each day</span>   
    </div>
  )
}
