import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import {
  X,
  Loader,
  FileText,
  Image,
  FileSearch,
  ArrowDown,
} from "lucide-react";
import InputArea from "./Components/InputArea";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "assistant";
  files?: File[];
  isWelcome?: boolean;
}

// Detect if running in Chrome extension environment
const isExtension =
  window.location.protocol === "chrome-extension:" ||
  document.querySelector("html")?.hasAttribute("data-extension") ||
  !!document.getElementById("extension-root");

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "👋 Welcome to Mini Assistant! I can help you with files and answer questions.",
      sender: "assistant",
      isWelcome: true,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Track if scrolling should be enabled
  // const shouldEnableScroll = messages.length > 3;

  const handleSend = () => {
    if (!input.trim() && files.length === 0) return;

    // Add user message to chat
    const newMessage: ChatMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      files: [...files],
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setFiles([]);

    // Simulate assistant response
    setIsLoading(true);
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        text: "I've processed your request. Here's the result.",
        sender: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Check if at bottom of chat when scrolling
  const checkIfScrollAtBottom = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // Consider "at bottom" if within 30px of the bottom
      const isAtBottomNow = scrollHeight - scrollTop - clientHeight < 30;
      setIsAtBottom(isAtBottomNow);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", checkIfScrollAtBottom);
      return () =>
        chatContainer.removeEventListener("scroll", checkIfScrollAtBottom);
    }
  }, []);

  // Scroll to bottom when new messages are added, but only if already at bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Set width styles based on environment
  const containerStyle = {
    width: isExtension ? "450px" : "100%",
    minWidth: isExtension ? "450px" : "320px",
    maxWidth: isExtension ? "450px" : "md",
    height: isExtension ? "600px" : "100vh", // Fixed height based on environment
    display: "flex",
    flexDirection: "column" as const, // TypeScript requires this explicit type
  };

  return (
    <div className="bg-gray-50 shadow-md mx-auto" style={containerStyle}>
      {/* Header */}
      <div className="bg-indigo-600 text-white p-3 text-center font-medium shadow-sm flex-shrink-0">
        Mini Assistant
      </div>

      {/* Chat Messages - Fixed height container with scrollbar */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-3 overflow-y-auto relative scroll-smooth"
        style={{
          minHeight: "0", // This is crucial to make flex child scrollable
        }}
        onScroll={checkIfScrollAtBottom}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            {/* Message bubble */}
            <div
              className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                message.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : message.isWelcome
                  ? "bg-indigo-100 text-indigo-900"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="break-words">{message.text}</div>

              {/* Feature highlights in welcome message */}
              {message.isWelcome && (
                <div className="mt-3 text-sm space-y-2">
                  <div className="flex items-center text-indigo-700">
                    <FileText size={16} className="mr-2" />
                    <span>Upload files for processing</span>
                  </div>
                  <div className="flex items-center text-indigo-700">
                    <Image size={16} className="mr-2" />
                    <span>Convert, compress, or extract from files</span>
                  </div>
                  <div className="flex items-center text-indigo-700">
                    <FileSearch size={16} className="mr-2" />
                    <span>Ask questions about your documents</span>
                  </div>
                </div>
              )}

              {/* Display file names if any */}
              {message.files && message.files.length > 0 && (
                <div className="mt-2 pt-2 border-t border-opacity-20 border-gray-200 text-xs">
                  {message.files.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${
                        message.sender === "user"
                          ? "text-indigo-100"
                          : "text-gray-600"
                      } mb-1`}
                    >
                      <span className="mr-1">📎</span>
                      <span className="truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="ml-1 opacity-75">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-left mb-3">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
              <Loader size={16} className="animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button - only shown when not at bottom */}
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-all z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={16} />
        </button>
      )}

      {/* Feature cards - above the text input */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <div className="text-xs text-gray-500 mb-2">
          Need ideas? Try asking:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          <button
            onClick={() => setInput("Extract text from this PDF")}
            className="snap-start flex-shrink-0 px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 hover:bg-gray-50"
          >
            Extract text from PDF
          </button>
          <button
            onClick={() => setInput("Compress this image")}
            className="snap-start flex-shrink-0 px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 hover:bg-gray-50"
          >
            Compress image
          </button>
          <button
            onClick={() => setInput("Summarize this document")}
            className="snap-start flex-shrink-0 px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 hover:bg-gray-50"
          >
            Summarize document
          </button>
        </div>
      </div>

      {/* File preview area */}
      {files.length > 0 && (
        <div className="px-3 py-2 bg-gray-100 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-white px-2 py-1 rounded text-xs border border-gray-300"
              >
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button
                  onClick={() => removeFile(file)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  aria-label="Remove file"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area with increased padding */}
      <div className="px-3 pb-3 pt-2 flex-shrink-0">
        <InputArea
          input={input}
          setInput={setInput}
          handleKeyPress={handleKeyPress}
          handleSend={handleSend}
          handleFileChange={handleFileChange}
          files={files}
        />
      </div>
    </div>
  );
}
