// Format messages
const formatMessages = (messages) => {
  console.log("messages:", messages);

  return messages.map(msg => {
    const sender = msg.role === "user" ? "You" : "AI";

    return msg.content;
  })
};
