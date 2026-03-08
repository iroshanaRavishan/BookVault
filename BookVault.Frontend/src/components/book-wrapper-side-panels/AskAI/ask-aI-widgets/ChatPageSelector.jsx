import React from "react";
import styles from "./chatpageselector.module.css";
import { useFlipBook } from "../../../../context/FlipBookContext";

export default function ChatPageSelector({ selectedPage }) {
  const { currentPageInfo } = useFlipBook();

  return (
    <div>ChatPageSelector</div>
  );
}
