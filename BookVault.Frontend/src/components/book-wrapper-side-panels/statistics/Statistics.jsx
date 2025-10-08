import React from 'react'
import styles from './statistics.module.css'
import QuickOverview from './statistics-widgets/quick-overview/QuickOverview'
import TotalTime from './statistics-widgets/TotalTime'
import TotalTimeComparison from './statistics-widgets/TotalTimeComparison'
import ReadingHourSummary from './statistics-widgets/ReadingHourSummary'

export default function Statistics() {
  return (
    <div className={styles.panel}>
      <QuickOverview />
      <TotalTime />
      <TotalTimeComparison />
      <ReadingHourSummary />
    </div>
  )
}
