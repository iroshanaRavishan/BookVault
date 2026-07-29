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
    const isUser = msg.role === "user";

    const sender = isUser ? "You" : "BookVault";
    const message = msg.content || "";

    // ---------- Check page before sender ----------
    if (y > pageHeight - marginBottom - 20) {
      doc.addPage();
      y = marginTop;
    }

    // Sender
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    if (isUser) {
      doc.text(sender, pageWidth - marginRight, y, {
        align: "right",
      });
    } else {
      doc.text(sender, marginLeft, y);
    }
    const lines = doc.splitTextToSize(message, maxWidth);

    lines.forEach((line) => {

      // Check page before every line
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }

      if (isUser) {
        doc.text(line, pageWidth - marginRight, y, {
          align: "right",
        });
      }

      y += 6;
    });
    y += 8;
  });
};
