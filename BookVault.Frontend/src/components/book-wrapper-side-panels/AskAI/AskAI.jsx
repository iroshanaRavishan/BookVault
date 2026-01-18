import React, { useRef } from 'react';

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  const hasNamedChatRef = useRef(false);
  return (
    <div>AskAI</div>
  )
}
