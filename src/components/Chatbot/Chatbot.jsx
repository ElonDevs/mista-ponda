import React, { useEffect, useRef, useState } from "react";
import styles from "./Chatbot.module.scss";

const API_BASE =
  import.meta.env.VITE_CHATBOT_API || "http://localhost:8000";

const INITIAL_MESSAGES = [
  {
    role: "bot",
    content: "Hi! I'm Panda 🐼 — ask me anything about this portfolio.",
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextHistory,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.reply ?? "..." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Sorry — I couldn't reach the chatbot server. Make sure the backend is running on " +
            API_BASE,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className={styles.window} role="dialog" aria-label="Chatbot">
          <div className={styles.header}>
            <span className={styles.title}>🐼 Panda Chat</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>

          <div ref={listRef} className={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  m.role === "user" ? styles.user : styles.bot
                }`}
              >
                {m.content}
              </div>
            ))}
            {isSending && (
              <div className={`${styles.message} ${styles.bot}`}>…</div>
            )}
          </div>

          <form className={styles.inputRow} onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={isSending || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
