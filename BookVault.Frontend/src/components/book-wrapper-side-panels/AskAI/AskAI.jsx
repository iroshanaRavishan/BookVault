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
import HistoryActionPopup from './ask-aI-widgets/history-action-popup/HistoryActionPopup';

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedPage, setAttachedPage] = useState(null);
  const [showInitialUI, setShowInitialUI] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [canContinueChat, setCanContinueChat] = useState(false);
  const [currentChatName, setCurrentChatName] = useState("New Chat");
  const [chatList, setChatList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHistoryActionPopup, setShowHistoryActionPopup] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      setShowInitialUI(false);
    }
  }, [messages]);

  const startNewChat = () => {
    setIsResetting(true);
    setMessages([]);
    setAttachedPage(null);
    setShowInitialUI(true);
    setCurrentChatName("New Chat");
    conversationIdRef.current = crypto.randomUUID();
    hasNamedChatRef.current = false; 
    setTimeout(() => setIsResetting(false), 0);
  };

  const hasMessages = messages.length > 0;

  const getChatName = (text) => {
    return text.length > 30 ? text.slice(0, 30) + "..." : text;
  };

  const STORAGE_KEY = "ai_chat_history";

  const getChatHistory = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  };

  const saveChatHistory = (history) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  };

  const saveMessageToLocal = (conversationId, chatName, message) => {
    const history = getChatHistory();
    let convo = history.find(c => c.conversationId === conversationId);
    const now = new Date().toISOString();

    if (!convo) {
      convo = {
        conversationId,
        chatName,
        createdAt: now,
        updatedAt: now,
        pinned: false,
        pinnedAt: null,
        messages: [],
      };
      history.push(convo);
    }

    convo.messages.push(message);
    convo.updatedAt = now;
    saveChatHistory(history);
  };

  const sortChats = (chats) => {
    return [...chats].sort((a, b) => {
      // pinned always on top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // both pinned newest pinned first
      if (a.pinned && b.pinned) {
        return new Date(b.pinnedAt) - new Date(a.pinnedAt);
      }

      // normal chats last active first
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  };

  const editMessage = (id, newText) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, text: newText } : m))
    );
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const sendMessage = async ({ text, page }) => {
    if (isResetting) return;

    // if user types while initial UI is visible then new chat
    if (showInitialUI) {
      startNewChat();
      setCanContinueChat(false);
    }

     setShowHistory(false);

    const now = new Date();
    const userMessage = {
      conversation_id: conversationIdRef.current,
      role: "user",
      content: text,
      created_at: now.toISOString(),
    };

    let chatNameToUse = currentChatName;

    if (!hasNamedChatRef.current) {
      chatNameToUse = getChatName(text);
      setCurrentChatName(chatNameToUse);
      hasNamedChatRef.current = true;
    }

    saveMessageToLocal(conversationIdRef.current, chatNameToUse, {
      role: "user",
      content: text,
      created_at: now.toISOString(),
    });

    setIsTyping(true);

    // Simulate assistant response (replace with real AI later)
    setTimeout(async () => {
      const botText = "Hi, how can I help you today...";

      const botMessage = {
        conversation_id: conversationIdRef.current,
        role: "assistant",
        content: botText,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: botText,
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date().toDateString(),
        },
      ]);
    }, 1000);
  };

  // this is for loading the history which is not implemented yet
  // const loadHistory = async () => {
  //   const res = await fetch("/api/chat/history");
  //   const data = await res.json();
  //   setMessages(data);
  //   setShowInitialUI(false);
  // };

  const closePopup = () => {
    setShowOverlay(false); // start fade-out

    setTimeout(() => {
      setShowHistoryActionPopup(false); // remove after animation
      setActiveChatId(null);
    }, 200); 
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

  const loadConversation = (chat) => {
    conversationIdRef.current = chat.conversationId;
    setCurrentChatName(chat.chatName);
    setMessages(
      chat.messages.map(m => ({
        id: crypto.randomUUID(),
        text: m.content,
        sender: m.role === "user" ? "user" : "bot",
        time: new Date(m.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(m.created_at).toDateString(),
      }))
    );

    setShowHistory(false);
    setShowInitialUI(false);
  };

  return (
    <div className={styles.panel}>
      <div
        className={styles.chatActionsIconBar} 
        //  ${ hasMessages ? styles.fine : styles.slideUp}
        style={{opacity: showInitialUI ? '0': '1'}}
      >
        <div className={styles.chatBackAndName}>
          <IoArrowBack
            style={{ marginTop: "2px", cursor: "pointer" }}
            onClick={() => {
              handleBeforeLeave(() => {
                setShowInitialUI(true);
                setCanContinueChat(messages.length > 0);
                setInputHeight(0);
                setMessage("");
              });
            }}
          />
          <span className={styles.chatName}>{currentChatName}</span>
        </div>
       
        <div className={styles.chatActionsIcons}>
          <FiPlus
            onClick={() =>
              handleBeforeLeave(() => {
                startNewChat();
                setMessage("");
                setInputHeight(0);
              })
            }
            style={{ cursor: "pointer" }} />
          <MdDelete />
          <IoSettingsSharp />
        </div>
      </div>

      <div className={styles.initialUiContainer}>
        <div className={styles.logoContainer}>
          <img src='/src/assets/logo mark.png' className={styles.profilePicture} />       
          <img src='/src/assets/AI.png' className={styles.AiPicture} />       
          <div className={styles.onlineTitle}>
            Always live <GoDotFill style={{marginTop: '2px'}} color='green' size={20}/>
          </div>
          <div className={styles.subtitle}>
            Make the read smart with the AI. Get instant answers about your books...
          </div>
        </div>

        <div className={styles.chipStackContainer}>
          <ChipStack />
        </div>

        <div className={styles.infoBar}>
          {/* <span>AI generated response may be inaccurate</span> */}
          <button className={styles.historyButton} onClick={toggleHistory}>
            History{" "}
            <span className={`${styles.chevron} ${showHistory ? styles.rotate : ""}`}>
              <FaChevronRight />
            </span>
          </button>

          {canContinueChat && (
            <button
              className={styles.continueChatButton}
              onClick={() => {
                setShowHistory(false);   
                setInitialUiSlide(false);
                setShowInitialUI(false); 
                setCanContinueChat(false);
              }}
            >
              Continue to chat
              <span className={styles.chevron}>
                <FaArrowRightLong />
              </span>
          </button>
          )}
        </div>

        {showHistory && (
          <div className={styles.wrapper}>
            <div className={styles.historyPanel}>
              {chatList.map(chat => (
                <div
                  key={chat.conversationId}
                    className={`${styles.historyItem} ${
                      activeChatId === chat.conversationId ? styles.activeHistoryItem : ""
                    }`}
                  onClick={() => loadConversation(chat)}
                >
                  <span>{chat.chatName} </span>
                  <span className={styles.historyItemDot}>
                  
                    <HiOutlineDotsHorizontal 
                      className={styles.dotsIcon} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChat(chat); 
                        setActiveChatId(chat.conversationId);
                        setShowHistoryActionPopup(true);
                        setShowOverlay(true);
                      }}
                    />
                  </span>
                </div>
              ))} 
            </div>
            {showHistoryActionPopup &&(
              <div className={styles.historyActionPopupPanel}>
              </div>
            )}
            
          </div>
        )}
      </div>

      <div className={styles.actionArea}>
        <ChatInput />
      </div>
    </div>
  );
}
