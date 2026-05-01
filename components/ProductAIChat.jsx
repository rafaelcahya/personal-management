"use client";

import { useState, useRef, useEffect } from "react";

const QUICK_PROMPTS = [
    "Body wash ran out today",
    "Bought Lifebuoy shampoo, 2 bottles",
    "Which products are running low?",
    "Add new product: Pantene conditioner",
];

function getToolLabel(name, status, data) {
    if (status === "running") {
        if (name === "search_product") return "Searching product...";
        if (name === "log_product_usage") return "Recording usage...";
        if (name === "add_product_stock") return "Adding stock...";
        if (name === "create_product_brand") return "Creating brand...";
        if (name === "create_product_name") return "Creating product name...";
        if (name === "create_product_entry") return "Creating product entry...";
    }
    if (status === "success") {
        if (name === "search_product")
            return `${data?.count ?? 0} product(s) found`;
        if (name === "log_product_usage")
            return `Usage recorded for ${data?.product_name ?? "product"} — remaining: ${data?.new_quantity ?? 0}`;
        if (name === "add_product_stock")
            return `Stock updated for ${data?.product_name ?? "product"} — total: ${data?.new_quantity ?? 0}`;
        if (name === "create_product_brand")
            return `Brand "${data?.brand}" created`;
        if (name === "create_product_name")
            return `Product name "${data?.product_name}" created`;
        if (name === "create_product_entry")
            return `"${data?.product} ${data?.brand}" added to inventory`;
    }
    if (status === "error") return data?.error ?? "Something went wrong";
    return name;
}

function ToolBadge({ event }) {
    const isRunning = event.status === "running";
    const isSuccess = event.status === "success";

    return (
        <div
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                isSuccess
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    : isRunning
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
        >
            {isRunning ? (
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
            ) : isSuccess ? (
                <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            ) : (
                <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            )}
            <span>{getToolLabel(event.name, event.status, event.data)}</span>
        </div>
    );
}

export default function ProductAIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const [toolEvents, setToolEvents] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingText, toolEvents]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const sendMessage = async (content) => {
        if (!content.trim() || isLoading) return;

        const newMessages = [...messages, { role: "user", content }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        setStreamingText("");
        setToolEvents([]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let fullText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const event = JSON.parse(line);

                        if (event.type === "text") {
                            fullText += event.chunk;
                            setStreamingText(fullText);
                        } else if (event.type === "tool") {
                            setToolEvents((prev) => {
                                const idx = prev.findIndex(
                                    (e) => e.name === event.name && e.status === "running",
                                );
                                if (idx >= 0) {
                                    const updated = [...prev];
                                    updated[idx] = event;
                                    return updated;
                                }
                                return [...prev, event];
                            });
                        }
                    } catch {
                        // ignore parse errors for incomplete lines
                    }
                }
            }

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: fullText },
            ]);
            setStreamingText("");
            setToolEvents([]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const hasActiveStream = streamingText || toolEvents.length > 0;

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Open AI Assistant"
            >
                {isOpen ? (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                )}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
                    style={{ height: "520px" }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 bg-indigo-600 text-white flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                            AI
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                Product Assistant
                            </p>
                            <p className="text-xs text-indigo-200">
                                Track usage & stock through chat
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Just type naturally — I can log usage, add stock, and even create new products automatically.
                                </p>
                                <div className="space-y-2">
                                    {QUICK_PROMPTS.map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() => sendMessage(prompt)}
                                            className="w-full text-left text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                                        msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-br-sm"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Active streaming area: tool events + text */}
                        {hasActiveStream && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] space-y-1.5">
                                    {toolEvents.length > 0 && (
                                        <div className="space-y-1">
                                            {toolEvents.map((event, i) => (
                                                <ToolBadge key={i} event={event} />
                                            ))}
                                        </div>
                                    )}
                                    {streamingText && (
                                        <div className="rounded-2xl rounded-bl-sm px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                            {streamingText}
                                            <span className="inline-block w-1 h-3 bg-indigo-500 ml-0.5 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Loading dots (before any stream starts) */}
                        {isLoading && !hasActiveStream && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <span
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        />
                                        <span
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "150ms" }}
                                        />
                                        <span
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. body wash ran out, bought Lifebuoy 2 bottles..."
                            disabled={isLoading}
                            className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={isLoading || !input.trim()}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
