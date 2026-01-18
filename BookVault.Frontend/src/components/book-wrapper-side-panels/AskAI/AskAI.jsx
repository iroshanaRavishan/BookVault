import React, { useRef } from 'react';

export default function AskAI() {
  const conversationIdRef = useRef(crypto.randomUUID());
  return (
    <div>AskAI</div>
  )
}
