import React, { useEffect, useRef, useState } from 'react';
import styles from './askai.module.css';
import MessageWall from './ask-aI-widgets/MessageWall';
import ChipStack from './ask-aI-widgets/ChipStack';
import { FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { IoArrowBack, IoSettingsSharp } from 'react-icons/io5';
import { FaChevronRight } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaArrowRightLong } from "react-icons/fa6";

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialUI, setShowInitialUI] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [currentChatName, setCurrentChatName] = useState("New Chat");
  const [chatList, setChatList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialUI(false);
    }
  }, [messages]);

  const startNewChat = () => {
    setIsResetting(true);
    setMessages([]);
    setShowInitialUI(true);
    setCurrentChatName("New Chat");
    conversationIdRef.current = crypto.randomUUID();
    hasNamedChatRef.current = false; 
    setTimeout(() => setIsResetting(false), 0);
  };

  const saveChatHistory = (history) => {
  };

  const editMessage = (id, newText) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, text: newText } : m))
    );
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };


  const handleBeforeLeave = (action) => {
    if (message.trim().length > 0) {
      // Unsaved text -> show confirm
      pendingActionRef.current = action;
      setShowConfirm(true);
    } else {
      // No text -> proceed directly
      action();
    } 
  };

  const toggleHistory = () => {
    const history = getChatHistory();
    setChatList(history);
    setShowHistory(prev => !prev); 
    setInitialUiSlide(prev => !prev);
  };

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
          <span className={styles.chatName}>{currentChatName}</span>
        </div>
       
        <div className={styles.chatActionsIcons}>
          <FiPlus style={{ cursor: "pointer" }} />
          <MdDelete />
          <IoSettingsSharp />
        </div>
      </div>

      <div className={styles.initialUiContainer}>
        <div className={styles.logoContainer}>
          <img src='/src/assets/logo mark.png' className={styles.profilePicture} />       
          <img src='/src/assets/AI.png' className={styles.AiPicture} />       
          <div className={styles.onlineTitle}>
            Always live
          </div>
          <div className={styles.subtitle}>
            Make the read smart with the AI. Get instant answers about your books...
          </div>
        </div>

        <div className={styles.chipStackContainer}>
          <ChipStack />
        </div>

        <div className={styles.infoBar}>
          <button className={styles.historyButton}>
            History{" "}
            <span className={styles.chevron}>
              <FaChevronRight />
            </span>
          </button>

          {canContinueChat && (
            <button className={styles.continueChatButton}>
              Continue to chat
              <span className={styles.chevron}>
                <FaArrowRightLong />
              </span>
          </button>
          )}
        </div>

        {showHistory && (
          <div className={styles.historyPanel}>
            {chatList.map(chat => (
              <div
                key={chat.conversationId}
                className={styles.historyItem}
              >
                <span> {chat.chatName} </span>
                <span className={styles.historyItemDate}>
                  {/* date */}
                  <HiOutlineDotsHorizontal 
                    className={styles.dotsIcon} 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </span>
              </div>
            ))} 

            {showHistoryActionPopup &&(
              <div className={styles.historyActionPopupPanel}>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
