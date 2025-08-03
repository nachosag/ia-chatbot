import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import Image from 'next/image';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setIsTyping(true);

      try {
        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            messages: [{ role: "user", content: input }]
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage = { text: data.reply, sender: "bot" };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          console.error("Error al llamar a la API");
          const errorMessage = { text: "Lo siento, algo salió mal.", sender: "bot" };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
      } catch (error) {
        console.error("Error de red:", error);
        const errorMessage = { text: "Lo siento, no pude conectarme.", sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>NachoSAG chatbot</title>
        <meta name="description" content="Chatbot de NachoSAG" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>Chatbot</div>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.sender === 'bot' && <Image src="/robot.svg" alt="bot avatar" width={30} height={30} className={styles.avatar} />}
                <div className={styles.messageContent}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.message} ${styles.bot}`}>
                <Image src="/robot.svg" alt="bot avatar" width={30} height={30} className={styles.avatar} />
                <div className={styles.typingIndicator}>
                  <span className={styles.typingDot}></span>
                  <span className={styles.typingDot}></span>
                  <span className={styles.typingDot}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className={styles.input}
              placeholder="Escribe tu mensaje..."
            />
            <button onClick={handleSend} className={styles.button}>
              Send
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

