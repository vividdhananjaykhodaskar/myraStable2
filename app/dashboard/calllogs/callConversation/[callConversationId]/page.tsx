"use client";

import { getConversationForCall } from "@/service/prservice";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ChatPage = () => {
  const { callConversationId } = useParams();
  const [chatInfo, setChatInfo] = useState<any>({});
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(callConversationId)) {
      return;
    }

    if (callConversationId) {
      getConversationForCall(callConversationId)
        .then((data) => {
          const { conversation, ...chatInfo } = data;
          setChatInfo(chatInfo);
          setMessages(conversation?.messages || []);
        })
        .finally(() => setLoading(false));
    } else {
      console.error("callConversationId is undefined");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-full flex-grow items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex p-1 h-screen w-9/12 flex-grow overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1">
        {/* Chat Header */}
        <header className="bg-transparent p-4 border rounded-lg border-[#3d3d3d] text-slate-200">
          <h1 className="text-2xl font-semibold">
            {`Chat with Myra on ${
              chatInfo?.createdAt
                ? moment(chatInfo.createdAt).format("MMM DD, YYYY, hh:mm A")
                : "Unknown Date"
            }`}
          </h1>
        </header>

        {/* Chat Messages */}
        <div className="h-screen overflow-y-auto p-4 pb-36">
          {messages?.length > 0 ? (
            messages.map((message: any, index: number) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  message?.role === "user" ? "justify-end" : ""
                }`}
              >
                <div>
                  <div
                    className={`flex flex-col max-w-96 rounded-xl ${
                      message?.role === "user"
                        ? "rounded-tr-none"
                        : "rounded-tl-none"
                    } p-3 gap-3 ${
                      message.role === "user"
                        ? "bg-[rgb(0,126,90,0.3)]"
                        : "bg-[rgb(0,126,90,0.8)]"
                    }`}
                  >
                    <p className="text-md font-medium underline">
                      {message.role.charAt(0).toUpperCase() +
                        message.role.slice(1)}
                    </p>
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-300 self-end ml-auto">
                      {moment(message.timestamp).format(
                        "MMM DD, YYYY, hh:mm A"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-grow items-center justify-center">
              <p>No Conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
