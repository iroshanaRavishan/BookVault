import React from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';


export default function Bookmarks() {
  const { bookid } =useParams(); 
  return (
    <div>Bookmark panel</div>
  )
}
