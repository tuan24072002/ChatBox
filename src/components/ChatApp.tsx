import { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import { v4 as uuidv4 } from 'uuid';
import { MessageCircleMore } from 'lucide-react';
import { cn } from '@/lib/utils';
import model from '@/lib/gemini';
import diagnosis_codes from "@/data/diagnosis_codes.json";
import icd_codes from "@/data/icd_codes.json";
import procedure_codes from "@/data/procedure_codes.json";
interface Message {
    id: string;
    time: string;
    text: string;
    senderId: string;
}

const ChatApp = () => {
    const [isShowMessage, setIsShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>(() => {
        const stored = localStorage.getItem('chatMessages');
        return stored ? JSON.parse(stored) : [];
    });
    const [userId, setUserId] = useState<string>('');
    const [unreadCount, setUnreadCount] = useState(0);

    const prePrompt = `
Bạn là một trợ lý ảo y khoa của **Bệnh viện Đa khoa Quốc tế Sài Gòn**. Nhiệm vụ của bạn là tư vấn sơ bộ về các vấn đề sức khỏe dựa trên cơ sở dữ liệu bệnh lý (định dạng JSON) được cung cấp.

**QUY TẮC QUAN TRỌNG NHẤT:**
* **Tự động nhận diện ngôn ngữ của người dùng (tiếng Việt, tiếng Anh, v.v.) và BẮT BUỘC chỉ sử dụng ngôn ngữ đó trong toàn bộ câu trả lời.**

**Khi tương tác với người dùng, hãy tuân thủ nghiêm ngặt các bước sau:**

1.  **Chào hỏi:** Bắt đầu bằng lời chào thân thiện, chuyên nghiệp và luôn nhắc đến "Bệnh viện Đa khoa Quốc tế Sài Gòn" trong câu đầu tiên.
2.  **Phân tích & Chẩn đoán:** Dựa vào triệu chứng người dùng mô tả, phân tích ngắn gọn, tra cứu trong file JSON để nêu ra chẩn đoán khả dĩ nhất và toa thuốc mẫu tương ứng.
3.  **Đưa ra khuyến nghị:** Cung cấp lời khuyên về chế độ sinh hoạt, dinh dưỡng phù hợp với chẩn đoán.
4.  **Giới hạn độ dài:** Giữ câu trả lời trong khoảng 120–150 từ, đảm bảo súc tích, dễ hiểu.
5.  **Thêm khuyến cáo an toàn:** Luôn kết thúc bằng câu: "Thông tin trên chỉ mang tính tham khảo. Bạn nên đến gặp bác sĩ tại Bệnh viện Đa khoa Quốc tế Sài Gòn để được chẩn đoán chính xác và điều trị phù hợp."
6.  **Từ chối ngoài phạm vi:** Nếu câu hỏi không liên quan đến y khoa, hãy lịch sự từ chối trong 1-2 câu (ví dụ: "Tôi là trợ lý y khoa và chỉ có thể hỗ trợ các câu hỏi về sức khỏe. Tôi có thể giúp gì khác cho bạn không?").
    `;

    const toggleChatbox = () => {
        setIsShowMessage((prev) => !prev);
        setUnreadCount(0);
        window.parent.postMessage(
            { type: 'CHATBOX_TOGGLE', open: !isShowMessage },
            '*'
        )
    }

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMsg: Message = {
            id: uuidv4(),
            time: new Date().toLocaleTimeString(),
            text: message,
            senderId: userId,
        };
        setMessages(prev => [...prev, userMsg]);
        setMessage('');

        const aiId = uuidv4();
        const aiMsg: Message = {
            id: aiId,
            time: new Date().toLocaleTimeString(),
            text: '',
            senderId: 'AI',
        };
        setMessages(prev => [...prev, aiMsg]);

        const result = await model.generateContentStream(
            prePrompt +
            "\n" +
            diagnosis_codes +
            "\n" +
            icd_codes +
            "\n" +
            procedure_codes +
            "\n" +
            message
        );
        let accumulated = '';

        for await (const chunk of result.stream) {
            const part = chunk.candidates?.[0].content.parts[0].text ?? '';
            accumulated += part;
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiId
                        ? { ...msg, text: accumulated }
                        : msg
                )
            );
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        if (!isShowMessage) {
            setUnreadCount(prev => prev + 1);
        }
    };

    useEffect(() => {
        let storedUserId = sessionStorage.getItem('userId');
        if (!storedUserId) {
            storedUserId = uuidv4();
            sessionStorage.setItem('userId', storedUserId);
        }
        setUserId(storedUserId);
    }, []);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);
    return (
        <>
            <div
                onClick={toggleChatbox}
                className={cn(
                    `fixed bottom-4 right-4 transition-all duration-500 bg-white/80 cursor-pointer size-16 rounded-full overflow-hidden border border-black z-10`
                )}
                style={{ pointerEvents: 'auto' }}
            >
                <div className="size-full flex items-center justify-center relative group">
                    <MessageCircleMore
                        className={cn(
                            'size-9 group-hover:rotate-60 transition-all duration-300',
                            isShowMessage && '-rotate-180'
                        )}
                    />
                    {unreadCount > 0 && (
                        <div className="size-4 bg-red-500 rounded-full absolute right-2 top-2 z-10 flex items-center justify-center text-white text-xs animate-bounce">
                            {unreadCount}
                        </div>
                    )}
                </div>
            </div>
            <ChatBox
                isShowMessage={isShowMessage}
                setIsShowMessage={setIsShowMessage}
                messages={messages}
                setMessages={setMessages}
                sendMessage={sendMessage}
                message={message}
                setMessage={setMessage}
                userId={userId}
            />
        </>
    );
};

export default ChatApp;
