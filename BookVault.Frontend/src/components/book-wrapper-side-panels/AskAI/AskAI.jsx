import React, { useEffect, useRef, useState } from 'react';
import styles from './askai.module.css';
import MessageWall from './ask-aI-widgets/MessageWall';
import ChatInput from './ask-aI-widgets/ChatInput';
import ExportPopup from "./ask-aI-widgets/export-popup/ExportPopup";
import { GoDotFill } from "react-icons/go";
import ChipStack from './ask-aI-widgets/ChipStack';
import { FiCheck, FiPlus } from 'react-icons/fi';
import { MdDelete, MdOutlineCancel } from 'react-icons/md';
import { IoArrowBack, IoSettingsSharp } from 'react-icons/io5';
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaArrowRightLong } from "react-icons/fa6";
import HistoryActionPopup from './ask-aI-widgets/history-action-popup/HistoryActionPopup';
import { BsFillPinAngleFill, BsPinFill } from 'react-icons/bs';
import { BiSolidEraser } from 'react-icons/bi';
import { GiCancel } from "react-icons/gi";
import { TiExport } from 'react-icons/ti';
import { RiShareForwardFill } from 'react-icons/ri';

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);
  const popupRef = useRef(null);
  const pendingActionRef = useRef(null);
  const historyRef = useRef(null);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedPage, setAttachedPage] = useState(null);
  const [showInitialUI, setShowInitialUI] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [canContinueChat, setCanContinueChat] = useState(false);
  const [currentChatName, setCurrentChatName] = useState("New Chat");
  const [showHistory, setShowHistory] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHistoryActionPopup, setShowHistoryActionPopup] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [isClosingExport, setIsClosingExport] = useState(false);
  const [selectedChatForAction, setSelectedChatForAction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const getDisplayName = (text, size) => {
    return text.length > size ? text.slice(0, size) + "..." : text;
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

  const togglePinChat = (conversationId) => {
    const history = getChatHistory();

    const updated = history.map(chat => {
      if (chat.conversationId === conversationId) {
        return {
          ...chat,
          pinned: !chat.pinned,
          pinnedAt: !chat.pinned ? new Date().toISOString() : null,
        };
      }
      return chat;
    });

    saveChatHistory(updated);

    const sorted = sortChats(updated);
    setChatList(sorted);

    // refresh activeChat from updated data
    const updatedActive = sorted.find(
      c => c.conversationId === conversationId
    );

    setActiveChat(updatedActive);
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
    const originalMsg = messages.find(m => m.id === id);
    if (!originalMsg) return;

    // send as a NEW message (this triggers bot reply)
    sendMessage({
      text: newText,
      page: originalMsg.page,
      editedFrom: id,
    });
  };

  const sendMessage = async ({ text, page }) => {
    const messageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();
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

    // Update UI immediately
    setMessages(prev => [
      ...prev,
      {
        id: messageId,
        text,
        page,
        sender: "user",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: now.toDateString(),
      },
    ]);
    
    // // Save user message
    // await fetch("/api/messages", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(userMessage),
    // });

    let chatNameToUse = currentChatName;

    if (!hasNamedChatRef.current) {
      chatNameToUse = getDisplayName(text, 35);
      setCurrentChatName(chatNameToUse);
      hasNamedChatRef.current = true;
    }

    saveMessageToLocal(conversationIdRef.current, chatNameToUse, {
      id: messageId,
      role: "user",
      content: text,
      created_at: now.toISOString(),
    });

    setIsTyping(true);

    // Simulate assistant response (replace with real AI later)
    setTimeout(async () => {
      const botText = "Hi, how can I help you today...";

      const botMessage = {
        id: assistantMessageId,
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

      // await fetch("/api/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(botMessage),
      // });

      saveMessageToLocal(conversationIdRef.current, chatNameToUse, {
        id: assistantMessageId,
        role: "assistant",
        content: botText,
        created_at: new Date().toISOString(),
      });
      setIsTyping(false);
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
    setShowOverlay(false);
    // start export closing animation
    setIsClosingExport(true);

    setTimeout(() => {
      setShowExportPopup(false);
      setIsClosingExport(false);

      setShowHistoryActionPopup(false);
      setActiveChatId(null);
      setSelectedChatForAction(null);
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
    setChatList(sortChats(history));
    setShowHistory(prev => !prev); 
  };

  const deleteConversation = (conversationId) => {
    const history = getChatHistory();

    const updatedHistory = history.filter(
      (chat) => chat.conversationId !== conversationId
    );

    saveChatHistory(updatedHistory);

    // update UI
    setChatList(updatedHistory);

    // if currently open chat is deleted reset UI
    if (conversationIdRef.current === conversationId) {
      startNewChat();
    }

    setShowHistoryActionPopup(false);
    setShowOverlay(false);
    setActiveChatId(null);
    closeExportPopup();
  };

  const loadConversation = (chat) => {
    conversationIdRef.current = chat.conversationId;
    setCurrentChatName(chat.chatName);
    setMessages(
      chat.messages.map(m => ({
        id: m.id,
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

  useEffect(() => {
    if (!showHistoryActionPopup) return;
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        closePopup(); // fade-out function
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHistoryActionPopup]);

  const handleExportClick = (chat) => {
    setSelectedChatForAction(chat);

    if (showExportPopup) {
      // CLOSE with animation
      setIsClosingExport(true);
      setTimeout(() => {
        setShowExportPopup(false);
        setIsClosingExport(false);
      }, 200);
    } else {
      // OPEN
      setShowExportPopup(true);
    }
  };

  const closeExportPopup = () => {
    setIsClosingExport(true);
    setShowExportPopup(false);
    setIsClosingExport(false);
  };

  return (
    <div
      className={styles.panel}
      onClick={(e) => {
        if (
          showHistoryActionPopup &&
          popupRef.current &&
          !popupRef.current.contains(e.target)
        ) {
          setShowHistoryActionPopup(false);
          setShowOverlay(false);
        }
      }}
    >
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
          <span className={styles.chatName}>{getDisplayName(currentChatName, 35)}</span>
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

      <div className={`${styles.initialUiContainer} ${ showInitialUI ? styles.slideDown : styles.slideUp }`}>
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
          <div className={styles.wrapper} ref={historyRef}>
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
                    <span className={styles.floatingPinIcon}>
                      {chat.pinned ? <BsPinFill className={styles.pinnedIcon} /> : ""}
                    </span>
                    <HiOutlineDotsHorizontal 
                      className={styles.dotsIcon} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChat(chat); 
                        setActiveChatId(chat.conversationId);
                        setSelectedChatForAction(chat); 
                        setShowHistoryActionPopup(true);
                        setShowOverlay(true);
                      }}
                    />
                  </span>
                </div>
              ))} 
            </div>
            {showHistoryActionPopup && (
              <div className={styles.overlay}>
                <div ref={popupRef} className={styles.historyActionPopupPanel} onClick={(e) => e.stopPropagation()}>
                  <HistoryActionPopup
                    isPinned={activeChat?.pinned}
                    onTogglePin={() => togglePinChat(activeChatId)}
                    onDelete={() => {
                      setShowDeleteConfirm(true);
                    }}
                    onRename={() => {
                      setEditingChatId(activeChatId);
                      setEditingValue(activeChat?.chatName || "");
                      closePopup();
                    }}
                    onExport={() => 
                      selectedChatForAction &&
                      handleExportClick(selectedChatForAction)
                    }
                  />
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>

      <div className={styles.actionArea}>
        <ChatInput
          value={message}
          onSend={(text) => {
            sendMessage({
              text
            });

            setAttachedPage(null);
            setReplyingTo(null);
          }}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {showConfirm && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.popupHeader}>
              <span className={styles.headerText}>
                The changes will be discarded. Please save or discard them before going back.
              </span>
            </div>

            <div className={styles.modalActionButtons}>
              <button
                className={styles.modalButtons}
                onClick={() => setShowConfirm(false)}
              >
                Back
              </button>

              <button
                className={styles.modalButtons}
                onClick={() => {
                  setShowConfirm(false);
                  setMessage("");

                  if (pendingActionRef.current) {
                    pendingActionRef.current();
                    pendingActionRef.current = null;
                  }
                }}
                style={{backgroundColor: '#f78080ff'}}
              >
                Ok, discard changes 
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmRename && (
        <div className={styles.modalBackdrop} style={{zIndex:'10'}}>
          <div className={styles.modal}>
            <div className={styles.popupHeader}>
              <span className={styles.headerText}>
                Do you want to cancel renaming and switch to the selected conversation?
              </span>
            </div>

            <div className={styles.modalActionButtons}>
              <button
                className={styles.modalButtons}
                onClick={() => {
                  setShowConfirmRename(false);
                }}
              >
                No, back to the history
              </button>

              <button
                className={styles.modalButtons}
                onClick={() => {
                  setShowConfirmRename(false);
                  setEditingChatId(null);
                }}
                style={{ backgroundColor: "#f78080ff" }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {showExportPopup && (
        <ExportPopup
          onSelect={handleExportSelect}
          onClose={closeExportPopup}
          isClosing={isClosingExport}
        />
      )}
      {showDeleteConfirm && (
        <div
          className={styles.modalBackdrop}
          style={{ zIndex: "20" }}
        >
          <div className={styles.modal}>
            <div className={styles.popupHeader}>
              <span className={styles.headerText}>
                This action cannot be undone.Do you want to delete this chat?
              </span>
            </div>

            <div className={styles.modalActionButtons}>
              <button
                className={styles.modalButtons}
                onClick={() => {
                  setShowDeleteConfirm(false);
                }}
              >
                Cancel
              </button>

              <button
                className={styles.modalButtons}
                style={{ backgroundColor: "#f78080ff" }}
                onClick={() => {
                  deleteConversation(activeChatId);
                  setShowDeleteConfirm(false);
                  setOpenedChatId(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
