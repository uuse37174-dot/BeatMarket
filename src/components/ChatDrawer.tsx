import React, { useState, useEffect, useRef } from "react";
import { Store, ChatMessage } from "../types";
import { useAuthContext } from "../context/AuthContext";
import { Send, X, Store as StoreIcon, ShieldCheck } from "lucide-react";
import { db, collection, addDoc, query, where, orderBy, onSnapshot } from "../lib/firebase";

interface Props {
  store: Store;
  onClose: () => void;
}

export const ChatDrawer: React.FC<Props> = ({ store, onClose }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to chat messages for this store
    const q = query(
      collection(db, "messages"),
      where("storeId", "==", store.id),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as ChatMessage)
      );
      setMessages(fetched);
    }, (err) => {
      console.warn("Messages snapshot fallback:", err.message);
    });

    return () => unsubscribe();
  }, [store.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const senderName = user ? user.displayName : "Guest Shopper";
    const senderId = user ? user.uid : `guest_${Date.now()}`;

    const newMsg = {
      storeId: store.id,
      senderId,
      senderName,
      receiverId: store.ownerId,
      text: input.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "messages"), newMsg);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      // Local fallback
      setMessages((prev) => [...prev, { ...newMsg, id: `local_${Date.now()}` }]);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-black border border-zinc-700">
            <img
              src={store.logoImage}
              alt={store.storeName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              {store.storeName}
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Shopkeeper Online
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-zinc-100/50 dark:bg-zinc-900/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
            <StoreIcon className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-xs font-semibold">Direct Message Line Active</p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Ask about product availability, custom orders, or pricing directly with {store.storeName}.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = user ? msg.senderId === user.uid : msg.senderName === "Guest Shopper";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] text-zinc-400 mb-1 px-1">
                  {msg.senderName}
                </span>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs ${
                    isMe
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-br-none font-medium shadow-md"
                      : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type your message to shopkeeper..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-40 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
