import React, { useState, useEffect } from "react";
import { Store } from "../types";
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, User } from "lucide-react";

interface Props {
  store: Store;
  onClose: () => void;
}

export const CallShopkeeperModal: React.FC<Props> = ({ store, onClose }) => {
  const [callState, setCallState] = useState<"dialing" | "connected" | "ended">("dialing");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    // Simulate auto-connection after 2.5 seconds
    const timer = setTimeout(() => {
      setCallState("connected");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (callState === "connected") {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallState("ended");
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-3xl max-w-sm w-full p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Animated Background Ripples */}
        {callState === "connected" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-64 h-64 rounded-full bg-emerald-500 animate-ping" />
          </div>
        )}

        {/* Store Logo Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-700 shadow-xl mb-4 bg-black">
          <img
            src={store.logoImage}
            alt={store.storeName}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-xl font-black text-white tracking-tight">{store.storeName}</h3>
        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Direct Shopkeeper Line
        </p>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">{store.phoneNumber}</p>

        {/* Call Status Badge */}
        <div className="my-6">
          {callState === "dialing" && (
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase animate-pulse flex items-center gap-1">
              Connecting Direct Line...
            </span>
          )}
          {callState === "connected" && (
            <span className="text-sm font-mono font-extrabold text-emerald-400 tracking-wider bg-emerald-950/60 px-4 py-1 rounded-full border border-emerald-800">
              {formatTimer(seconds)}
            </span>
          )}
          {callState === "ended" && (
            <span className="text-xs font-bold text-rose-400 tracking-wider uppercase">
              Call Ended
            </span>
          )}
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full border transition-all ${
              isMuted
                ? "bg-rose-500/20 border-rose-500 text-rose-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg transition-transform hover:scale-105"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <a
            href={`tel:${store.phoneNumber}`}
            className="p-4 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all"
            title="Launch System Phone Dial"
          >
            <Volume2 className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
