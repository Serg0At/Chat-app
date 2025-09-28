async function sendMessage(senderId, receiverId, text) {
  // Проверяем есть ли диалог
  let convo = await pg("conversations as c")
    .join("participants as p1", "c.id", "p1.conversation_id")
    .join("participants as p2", "c.id", "p2.conversation_id")
    .where("c.type", "direct")
    .where("p1.user_id", senderId)
    .where("p2.user_id", receiverId)
    .first("c.*");

  // Если диалога нет → создаём
  if (!convo) {
    const [conversation] = await pg("conversations")
      .insert({ type: "direct" })
      .returning("*");

    await pg("participants").insert([
      { conversation_id: conversation.id, user_id: senderId },
      { conversation_id: conversation.id, user_id: receiverId },
    ]);

    convo = conversation;
  }

  // Вставляем сообщение
  const [message] = await pg("messages")
    .insert({
      conversation_id: convo.id,
      sender_id: senderId,
      text,
    })
    .returning("*");

  return message;
}
