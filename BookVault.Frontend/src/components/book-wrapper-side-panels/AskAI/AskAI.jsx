import React, { useRef } from 'react';
import MessageWall from './ask-aI-widgets/MessageWall';

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);
  return (
    <div>AskAI</div>
  )
}
