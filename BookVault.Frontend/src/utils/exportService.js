import { jsPDF } from "jspdf";

// Format messages
const formatMessages = (messages) => {
  console.log("messages:", messages);

  return messages.map(msg => {
    const sender = msg.role === "user" ? "You" : "AI";

    return `${sender}:\n${msg.content}\n\n`;
  }).join("");
};

// PDF EXPORT
export const exportChatToPDF = (chat) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Margins
  const marginLeft = 15;
  const marginRight = 15;
  const marginTop = 20;
  const marginBottom = 20;

  const maxWidth = pageWidth - marginLeft - marginRight;

  let y = marginTop;

  // Chat title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(chat.chatName || "Chat Export", pageWidth / 2, y, {
    align: "center",
  });

  y += 15;

  chat.messages.forEach((msg) => {
    lines.forEach((line) => {

      // Check page before every line
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
      y += 6;
    });
    y += 8;
  });
};
