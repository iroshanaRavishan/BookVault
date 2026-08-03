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

    y += 6;

    // Message
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

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
      } else {
        doc.text(line, marginLeft, y);
      }

      y += 6;
    });
    y += 8;
  });

  doc.save(`${chat.chatName || "chat"}.pdf`);
};

// WORD EXPORT
export const exportChatToWord = async (chat) => {
  const children = [];

  // Chat Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
      children: [
        new TextRun({
          text: chat.chatName || "Chat Export",
          bold: true,
          size: 32, // 16pt
        }),
      ],
    })
  );

  chat.messages.forEach((msg) => {
    const isUser = msg.role === "user";
    const sender = isUser ? "You" : "BookVault";

    // Sender
    children.push(
      new Paragraph({
        alignment: isUser
          ? AlignmentType.RIGHT
          : AlignmentType.LEFT,
        spacing: {
          after: 100,
        },
        children: [
          new TextRun({
            text: sender,
            bold: true,
            size: 24,
          }),
        ],
      })
    );

    // Message
    children.push(
      new Paragraph({
        alignment: isUser
          ? AlignmentType.RIGHT
          : AlignmentType.LEFT,
        spacing: {
          after: 250,
        },
        children: [
          new TextRun({
            text: msg.content || "",
          }),
        ],
      })
    );
  });

};