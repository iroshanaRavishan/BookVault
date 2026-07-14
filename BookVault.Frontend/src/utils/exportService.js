// Format messages
const formatMessages = (messages) => {
  console.log("messages:", messages);

  return messages.map(msg => {
    return msg.content;
  })
};
