import React, { useRef } from 'react';
import MessageWall from './ask-aI-widgets/MessageWall';

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className={styles.panel}>
      <div className={styles.chatActionsIconBar}>
      </div>
    </div>
  );
}
