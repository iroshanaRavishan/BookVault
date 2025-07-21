import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function BookmarkListener({ onBookmarkCreated, onBookmarkDeleted }) {
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

    connection.on("BookmarkDeleted", (bookmarkId) => {
      console.log("Bookmark deleted:", bookmarkId);
      if (onBookmarkDeleted){
         onBookmarkDeleted(bookmarkId);
      }
    });

    return () => {
      connection.stop();
    };
  }, [onBookmarkCreated, onBookmarkDeleted]);

  return null; // This component doesn't render UI
}
