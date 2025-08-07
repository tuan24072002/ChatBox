import { cn } from "@/lib/utils";
import { Bot, ChevronDown, ChevronRight, Ellipsis, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import { Assets } from "@/assets";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

const ChatBox = ({
  isShowMessage,
  setIsShowMessage,
  messages,
  setMessages,
  sendMessage,
  setMessage,
  message,
  userId,
  toggleChatbox,
  isTyping,
}: {
  isShowMessage: boolean;
  setIsShowMessage: (e: boolean) => void;
  messages: Message[];
  setMessages: (e: Message[]) => void;
  sendMessage: VoidFunction;
  setMessage: (e: string) => void;
  message: string;
  userId: string;
  toggleChatbox: VoidFunction;
  isTyping: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      style={{ pointerEvents: "auto" }}
      className={cn(
        "fixed bottom-22 right-4 w-[400px] h-[500px] shadow-md border overflow-hidden rounded-lg transition-transform duration-300 bg-white z-10",
        isShowMessage ? "translate-x-0" : "translate-x-[416px]"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="w-12 h-12 rounded-full border overflow-hidden">
            <img
              src={Assets.LogoTMHSG}
              alt="Avatar"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <p className="flex-1 pl-2 font-semibold text-lg">Trợ lý ảo</p>
          <div className="flex items-center gap-2">
            <Popover open={showPopover} onOpenChange={setShowPopover}>
              <PopoverTrigger asChild>
                <button className="p-2 rounded-full bg-slate-200 hover:bg-slate-300">
                  <Ellipsis className="text-black/50" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-0">
                <Button
                  onClick={() => {
                    toggleChatbox();
                    setShowPopover(false);
                    setIsShowMessage(false);
                    setTimeout(() => {
                      setMessages([
                        {
                          id: uuidv4(),
                          senderId: "AI",
                          text: `Chào bạn, tôi là trợ lý ảo y khoa của **Bệnh viện Đa khoa Quốc tế Sài Gòn**, rất vui được hỗ trợ bạn!`,
                          time: new Date().toLocaleTimeString(),
                        },
                      ]);
                    }, 200);
                  }}
                  className="w-full bg-transparent hover:bg-transparent border-none text-red-500 font-semibold"
                >
                  Kết thúc cuộc trò chuyện
                </Button>
              </PopoverContent>
            </Popover>
            <button
              onClick={toggleChatbox}
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300"
            >
              <ChevronDown className="text-black/50" />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 py-2 border-t"
          ref={containerRef}
        >
          {messages.length === 0 && (
            <p className="text-xs text-center text-gray-500 pt-10">
              Bắt đầu trò chuyện nhanh với CHATBOX SYSTEM. <br />
              Thông tin của bạn được ẩn và tin nhắn chỉ lưu trên trình duyệt.
            </p>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-end gap-2 mb-2",
                msg.senderId === userId ? "justify-end" : "justify-start"
              )}
            >
              {msg.senderId !== userId && (
                <Bot className="size-10 p-2 bg-blue-700 text-white rounded-full" />
              )}
              <div className="max-w-[70%] flex flex-col">
                <div
                  className={cn(
                    "py-2 px-4 rounded-md shadow wrap-break-word",
                    msg.senderId === userId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.senderId === userId ? (
                  <small className="text-xs text-right text-gray-400 mt-1">
                    {msg.time}
                  </small>
                ) : (
                  <small className="text-xs text-gray-400 mt-1">
                    {msg.time}
                  </small>
                )}
              </div>
              {msg.senderId === userId && (
                <User className="size-10 p-2 bg-blue-700 text-white rounded-full" />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 mb-2">
              <Bot className="size-10 p-2 bg-blue-700 text-white rounded-full opacity-50" />
              <div className="py-2 px-3 bg-gray-200 rounded-md inline-flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 h-16 px-4 border-t border-gray-200">
          <input
            type="text"
            name="chat"
            id="chat"
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            placeholder="Nhập tin nhắn, nhấn Enter để gửi..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition-transform active:scale-95"
            aria-label="Gửi"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
