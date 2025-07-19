import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function BookmarkListener({ onBookmarkCreated }) {
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7157/hubs/notifications")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("Connected to SignalR"))
      .catch(err => console.error("SignalR Error:", err));

    connection.on("BookmarkCreated", (bookmark) => {
      console.log("New Bookmark received:", bookmark);
      if (onBookmarkCreated) {
        onBookmarkCreated(bookmark); // Notify parent
      }
    });

    return () => {
      connection.stop();
    };
  }, [onBookmarkCreated]);

  return null; // This component doesn't render UI
}