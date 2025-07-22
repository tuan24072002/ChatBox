import { cn } from '@/lib/utils'
import { Bot, ChevronDown, ChevronRight, Ellipsis, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from './ui/button';
import ReactMarkdown from 'react-markdown';
import { Assets } from '@/assets';
import { v4 as uuidv4 } from 'uuid';
const ChatBox = ({
    isShowMessage,
    setIsShowMessage,
    messages,
    setMessages,
    sendMessage,
    setMessage,
    message,
    userId,
    toggleChatbox
}: {
    isShowMessage: boolean
    setIsShowMessage: (e: boolean) => void
    messages: Message[]
    setMessages: (e: Message[]) => void
    sendMessage: VoidFunction
    setMessage: (e: string) => void
    message: string
    userId: string
    toggleChatbox: VoidFunction
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showPopover, setShowPopover] = useState(false);
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        element?.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages, isShowMessage])
    return (
        <div style={{ pointerEvents: 'auto' }} className={cn(`fixed bottom-22 right-4 w-[400px] h-[500px] border border-black overflow-hidden rounded-lg transition-all duration-300 bg-white z-10`, isShowMessage ? 'translate-x-0' : 'translate-x-[416px]')}>
            <div className="size-full flex flex-col">
                <div className="w-full h-20 flex items-center justify-between px-2">
                    <div className="size-12 overflow-hidden rounded-full border relative">
                        <img src={Assets.LogoTMHSG} alt="Avatar" className="size-full object-contain p-1" />
                    </div>
                    <p className="flex-1 text-left pl-2 font-semibold text-lg">Trợ lý ảo</p>
                    <div className="w-24 h-12 flex items-center justify-between">
                        <Popover open={showPopover} onOpenChange={setShowPopover}>
                            <PopoverTrigger asChild>
                                <div className="size-10 rounded-full bg-slate-200 cursor-pointer hover:bg-slate-300 flex items-center justify-center">
                                    <Ellipsis className="text-black/50" />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent align='end' className='w-52 h-auto p-0'>
                                <Button
                                    onClick={() => {
                                        toggleChatbox();
                                        setShowPopover(false);
                                        setIsShowMessage(false)
                                        setTimeout(() => {
                                            setMessages([{
                                                id: uuidv4(),
                                                senderId: 'AI',
                                                text: `Chào bạn, tôi là trợ lý ảo y khoa của **Bệnh viện Đa khoa Quốc tế Sài Gòn**, rất vui được hỗ trợ bạn!`,
                                                time: new Date().toLocaleTimeString()
                                            }])
                                        }, 200);
                                    }}
                                    className='w-full bg-transparent hover:bg-transparent border-none ring-0 text-red-500 font-semibold cursor-pointer'
                                >
                                    Kết thúc cuộc trò chuyện
                                </Button>
                            </PopoverContent>
                        </Popover>
                        <div className="size-10 rounded-full bg-slate-200 cursor-pointer hover:bg-slate-300 flex items-center justify-center" onClick={toggleChatbox}>
                            <ChevronDown className="text-black/50" />
                        </div>
                    </div>
                </div>
                <div className="h-[calc(500px-144px)]  border-t border-b border-black overflow-y-auto" ref={containerRef}>
                    {
                        messages.length === 0 &&
                        <p className="text-xs max-w-[80%] mx-auto pt-10 text-center">Bắt đầu trò chuyện nhanh với CHATBOX SYSTEM. <br />
                            Thông tin của bạn được ẩn và tin nhắn trò chuyện chỉ lưu trên trình duyệt web.</p>
                    }
                    {messages.map((msg, index: number) => {
                        if (msg.senderId === userId && msg.text !== "") {
                            return (
                                <div key={index} className="p-2 flex items-end gap-2 justify-start">
                                    <div title='Người dùng' className='size-10 bg-blue-700 text-white rounded-full border flex items-center justify-center cursor-pointer'>
                                        <User />
                                    </div>
                                    <div className='h-full w-full max-w-2/3 flex flex-col items-start gap-1'>
                                        <div className='h-full max-w-full w-fit flex flex-col items-start box-shadow-custom overflow-x-hidden overflow-y-visible text-black py-2 px-4 rounded-md shadow wrap-break-word'>
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                        <small className='text-xs font-semibold'>{msg.time}</small>
                                    </div>
                                </div>
                            )
                        } else if (msg.senderId === 'AI' && msg.text !== "") {
                            return (
                                <div key={index} className="p-2 flex items-end gap-2 justify-end">
                                    <div className='h-full w-full max-w-2/3 flex flex-col items-end gap-1'>
                                        <div className='h-full max-w-full w-fit flex flex-col items-start text-left box-shadow-custom overflow-x-hidden overflow-y-visible text-black py-2 px-4 rounded-md shadow'>
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                        <small className='text-xs font-semibold'>{msg.time}</small>
                                    </div>
                                    <div title='Trợ lý ảo' className='size-10 bg-blue-700 text-white rounded-full border flex items-center justify-center cursor-pointer'>
                                        <Bot />
                                    </div>
                                </div>
                            )
                        } else {
                            return null;
                        }
                    })}
                </div>
                <div className="w-full h-16 flex gap-2 items-center justify-between px-6">
                    <input
                        type="text"
                        name="chat"
                        id="chat"
                        className="text-sm outline-none border-none bg-transparent flex-1 select-none"
                        placeholder="Nhập tin nhắn, nhấn enter để gửi..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className="size-10 rounded-full bg-blue-200 cursor-pointer hover:bg-blue-300 flex items-center justify-center" onClick={sendMessage}>
                        <ChevronRight className="text-black/50" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatBox