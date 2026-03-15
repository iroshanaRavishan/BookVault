import React, { useEffect, useRef, useState } from 'react';
import styles from './askai.module.css';
import MessageWall from './ask-aI-widgets/MessageWall';

import { IoArrowBack } from 'react-icons/io5';
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialUI, setShowInitialUI] = useState(true);

  return (
    <div className={styles.panel}>
      <div
        className={styles.chatActionsIconBar} 
        style={{opacity: showInitialUI ? '0': '1'}}
      >
        <div className={styles.chatBackAndName}>
          <IoArrowBack/>
          <span className={styles.chatName}>Chat Name</span>
        </div>
      </div>
    </div>
  );
}
