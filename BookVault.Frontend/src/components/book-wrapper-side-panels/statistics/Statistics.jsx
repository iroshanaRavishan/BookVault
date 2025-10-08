import React from 'react'
import styles from './statistics.module.css'
import QuickOverview from './statistics-widgets/quick-overview/QuickOverview'
import TotalTime from './statistics-widgets/total-time/TotalTime'
import TotalTimeComparison from './statistics-widgets/total-time-comparison/TotalTimeComparison'
import ReadingHourSummary from './statistics-widgets/reading-hours/ReadingHourSummary'
import ScreenTimeHeatMap from './statistics-widgets/screen-time-heatmap/ScreenTimeHeatMap'
import Goal from './statistics-widgets/goal/Goal'

export default function Statistics() {
  return (
    <div className={styles.panel}>
      <QuickOverview />
      <TotalTime />
      <TotalTimeComparison />
      <ReadingHourSummary />
      <ScreenTimeHeatMap />
      <Goal /> 
    </div>
  )
}
