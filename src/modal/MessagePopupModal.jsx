import React, { useState, useEffect, useRef } from "react";
import { Video, MoreVertical, X, Send } from "lucide-react";
import { IoAttachOutline, IoCallOutline } from "react-icons/io5";
import { fetchChatData, initChatWithUser, sendMediaMessage, sendTextMessage } from "../Hooks/useSeller";
import { FaFileCsv } from "react-icons/fa";

export default function MessagePopupModal({ isOpen, onClose, fullName, title, uuid, avatar }) {
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [messageType, setMessageType] = useState("text"); // what will be sent
    const [attachmentMode, setAttachmentMode] = useState("auto"); // "auto" | "image" | "video" | "audio" | "file"
    const [uploadProgress, setUploadProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [attachMenuOpen, setAttachMenuOpen] = useState(false);
    const scrollRef = useRef();

    // ref to single hidden file input
    const fileInputRef = useRef(null);

    // map attachmentMode to accept attribute
    const acceptMap = {
        auto: "image/*,video/*,audio/*,*/*",
        image: "image/*",
        video: "video/*",
        audio: "audio/*",
        file: "*/*",
    };

    useEffect(() => {
        
        if (!isOpen) return;

        setMessages([]);
        setChatId(null);
        setSelectedFile(null);
        setMessageType("text");
        setAttachmentMode("auto");
        setUploadProgress(null);

        if (!uuid) return;

        setLoading(true);
        initChatWithUser(uuid)
            .then((chat) => {
                if (chat?.id) {
                    setChatId(chat.id);
                    return fetchChatData(chat.id);
                } else {
                    throw new Error("No chat returned from init");
                }
            })
            .then((res) => {
                const normalized = Array.isArray(res?.data) ? res.data : (res?.data?.data || res?.data || []);
                // ensure chronological order (oldest -> newest)
                setMessages(normalized.reverse());
            })
            .catch((err) => {
                console.error("chat init/load failed:", err);
            })
            .finally(() => setLoading(false));
    }, [isOpen, uuid]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendText = async () => {
        if (!message.trim() || !chatId) return;
        setLoading(true);
        try {
            const res = await sendTextMessage(chatId, { message: message.trim(), message_type: "text" });
            const newMsg = res?.data || res?.data?.data || res || {};
            setMessages((prev) => [...prev, newMsg]);
            setMessage("");
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    const detectTypeFromMime = (file) => {
        const mime = file?.type || "";
        if (mime.startsWith("image/")) return "image";
        if (mime.startsWith("video/")) return "video";
        if (mime.startsWith("audio/")) return "audio";
        return "file";
    };

    // When user chooses a type from the attach menu, open file picker with that accept
    const handleChooseAttachmentType = (mode) => {
        setAttachMenuOpen(false);
        setAttachmentMode(mode);

        // update accept and click input
        const input = fileInputRef.current;
        if (input) {
            input.accept = acceptMap[mode] || acceptMap.auto;
            // clear previous value so change fires even if same file chosen
            input.value = "";
            // programmatically open file picker
            input.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setSelectedFile(null);
            return;
        }

        // if user chose "auto" determine type from mime, otherwise respect attachmentMode
        const resolvedType = attachmentMode === "auto" ? detectTypeFromMime(file) : attachmentMode;

        setSelectedFile(file);
        setMessageType(resolvedType);
    };

    const handleSendMedia = async () => {
        if (!selectedFile || !chatId) return;
        setUploadProgress(0);
        try {
            // When attachmentMode is not auto, override message_type to the chosen mode
            const payloadMessageType = attachmentMode === "auto" ? messageType : attachmentMode;

            const res = await sendMediaMessage(
                chatId,
                { message: message.trim() || "", message_type: payloadMessageType, file: selectedFile },
                (percent) => setUploadProgress(percent)
            );
            const newMsg = res?.data || res?.data?.data || res || {};
            setMessages((prev) => [...prev, newMsg]);
            setSelectedFile(null);
            setMessage("");
            setUploadProgress(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to upload media");
            setUploadProgress(null);
        }
    };

    // close attach menu when clicking outside
    useEffect(() => {
        const onClick = (e) => {
            if (!attachMenuOpen) return;
            // If click is outside the menu and outside the attach button, close menu.
            // We rely on ids/classes below to identify menu region.
            const menu = document.getElementById("attach-menu-popover");
            const button = document.getElementById("attach-button");
            if (menu && !menu.contains(e.target) && button && !button.contains(e.target)) {
                setAttachMenuOpen(false);
            }
        };
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, [attachMenuOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[800px] h-[80vh] rounded-xl shadow-lg relative border border-gray-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                        <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <h2 className="text-sm font-semibold">{fullName}</h2>
                            <p className="text-xs text-green-600">● Online</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="flex items-center space-x-1 border rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-gray-100">
                            <Video className="w-4 h-4" />
                            <span>Video Call</span>
                        </button>
                        <button className="border rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-gray-100">
                            <IoCallOutline className="h-4 w-4" />
                        </button>
                        <div className="rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-gray-100">
                            <MoreVertical className="w-5 h-5" />
                        </div>
                        <div className="rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-gray-100">
                            <X className="w-5 h-5" onClick={onClose} />
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 text-xs"
                >
                    {loading && messages.length === 0 && (
                        <div className="text-center text-sm text-gray-500">Loading chat...</div>
                    )}

                    {messages.map((msg) => {
                        const isOther = msg.sender?.uuid === uuid;
                        return (
                            <div key={msg.id || Math.random()} className={`flex ${isOther ? "justify-start" : "justify-end"}`}>
                                <div
                                    className={`px-3 py-2 rounded-lg max-w-[70%] ${isOther ? "bg-gray-100 text-gray-900" : "bg-teal-500 text-white"}`}
                                >
                                    {msg.message ? <p>{msg.message}</p> : null}

                                    {/* handle media */}
                                    {msg.media && msg.message_type === "image" && (
                                        <img src={msg.media.url} alt="img" className="max-w-xs rounded-lg mt-1" />
                                    )}
                                    {msg.media && msg.message_type === "video" && (
                                        <video src={msg.media.url} controls className="max-w-xs rounded-lg mt-1" />
                                    )}
                                    {msg.media && msg.message_type === "audio" && (
                                        <audio src={msg.media.url} controls className="mt-1" />
                                    )}
                                    {msg.media && msg.message_type === "file" && (
                                        <a href={msg.media.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 mt-1 block">
                                            {msg.media.name || msg.media.file_name}
                                        </a>
                                    )}

                                    <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Box with media controls */}
                <div className="border-t border-gray-200 p-3">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 form-input rounded-lg px-3 py-2 text-xs"
                        />

                        {/* Attach icon + popover */}
                        <div className="relative">
                            <button
                                id="attach-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAttachMenuOpen((s) => !s);
                                }}
                                className="px-2 py-2 border rounded-lg text-xs hover:bg-gray-100"
                            >
                                <IoAttachOutline className="h-4 w-4" />
                            </button>

                            {attachMenuOpen && (
                                <div
                                    id="attach-menu-popover"
                                    className="absolute bottom-full mb-2 right-0 w-32 bg-white border rounded shadow z-50 text-xs"
                                >
                                    <div className="flex flex-col">
                                        <button
                                            className="text-left px-3 py-2 hover:bg-gray-100"
                                            onClick={() => handleChooseAttachmentType("image")}
                                        >
                                            Image
                                        </button>
                                        <button
                                            className="text-left px-3 py-2 hover:bg-gray-100"
                                            onClick={() => handleChooseAttachmentType("video")}
                                        >
                                            Video
                                        </button>
                                        <button
                                            className="text-left px-3 py-2 hover:bg-gray-100"
                                            onClick={() => handleChooseAttachmentType("audio")}
                                        >
                                            Audio
                                        </button>
                                        <button
                                            className="text-left px-3 py-2 hover:bg-gray-100"
                                            onClick={() => handleChooseAttachmentType("file")}
                                        >
                                            File
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            id="chat-file-input"
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => {
                                // if file selected -> send media, else send text
                                if (selectedFile) handleSendMedia();
                                else handleSendText();
                            }}
                            className="bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>

                    {(selectedFile || uploadProgress !== null) && (
                        <div className="mt-2 text-xs">
                            {selectedFile && (
                                <div className="flex items-center space-x-3">
                                    {selectedFile.type.startsWith("image/") && (
                                        <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-12 h-12 object-cover rounded" />
                                    )}
                                    <div>
                                        <div>{selectedFile.name}</div>
                                        <div className="text-gray-500 text-xs">{Math.round(selectedFile.size / 1024)} KB</div>
                                        <div className="text-gray-400 text-xs">Mode: {attachmentMode}</div>
                                    </div>
                                </div>
                            )}

                            {uploadProgress !== null && (
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded h-2">
                                        <div className="bg-teal-500 h-2 rounded" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                    <div className="text-xs mt-1">{uploadProgress}%</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
