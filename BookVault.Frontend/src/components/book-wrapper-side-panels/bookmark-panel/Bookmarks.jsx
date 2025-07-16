import React from 'react';
import styles from './bookmarks.module.css';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

export default function Bookmarks({ openedAt }) {
  const { id } =useParams(); 
  const {user} = useUser();
  
  return (
    <div>Bookmark panel</div>
  )
}
