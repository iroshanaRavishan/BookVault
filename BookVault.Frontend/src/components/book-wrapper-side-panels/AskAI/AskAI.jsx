import React, { useEffect, useRef, useState } from 'react';
import styles from './askai.module.css';
import MessageWall from './ask-aI-widgets/MessageWall';

import { FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { IoArrowBack, IoSettingsSharp } from 'react-icons/io5';

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialUI, setShowInitialUI] = useState(true);

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialUI(false);
    }
  }, [messages]);

  return (
    <div className={styles.panel}>
      <div
        className={styles.chatActionsIconBar} 
        style={{opacity: showInitialUI ? '0': '1'}}
      >
        <div className={styles.chatBackAndName}>
          <IoArrowBack
            style={{ marginTop: "2px", cursor: "pointer" }}
          />
          <span className={styles.chatName}>Chat Name</span>
       
        <div className={styles.chatActionsIcons}>
          
        </div>
      </div>
    </div>
  );
}
