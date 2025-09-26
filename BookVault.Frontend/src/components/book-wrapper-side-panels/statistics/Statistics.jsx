import React from 'react'
import styles from './statistics.module.css'
import QuickOverview from './statistics-widgets/QuickOverview'

export default function Statistics() {
  return (
    <div className={styles.panel}>
      <QuickOverview />
    </div>
  )
}
