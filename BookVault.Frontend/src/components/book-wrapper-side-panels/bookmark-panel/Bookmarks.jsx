import React from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

export default function Bookmarks() {
  const { bookid } =useParams(); 
  const {user} = useUser();
  
  return (
    <div>Bookmark panel {user.id}</div>
  )
}
