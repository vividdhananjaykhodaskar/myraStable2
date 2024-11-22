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
        <header className="bg-transparent py-3 lg:p-4 border rounded-lg border-[#3d3d3d] text-slate-200">
          <h1 className="text-base md:text-lg xl:text-2xl font-semibold">
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
                  <div
                    className={`flex flex-col max-w-[75dvw] lg:max-w-[42dvw] xl:max-w-[30dvw] w-full rounded-xl 2xl:rounded-2xl ${
                      message?.role === "user"
                        ? "rounded-tr-none 2xl:rounded-tr-none"
                        : "rounded-tl-none 2xl:rounded-tl-none"
                    } p-3 gap-3 ${
                      message.role === "user"
                        ? "bg-[rgb(0,126,90,0.3)]"
                        : "bg-[rgb(0,126,90,0.8)]"
                    }`}
                  >
                    <p className="text-base lg:text-lg font-medium flex items-center gap-1">
                      {
                        message?.role === "user" ? <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.01917 15.0769C5.7275 14.5513 6.49917 14.1363 7.33417 13.8317C8.16903 13.5272 9.05764 13.375 10 13.375C10.9424 13.375 11.831 13.5272 12.6658 13.8317C13.5008 14.1363 14.2725 14.5513 14.9808 15.0769C15.4989 14.5074 15.9094 13.8483 16.2123 13.0994C16.5152 12.3505 16.6667 11.5396 16.6667 10.6667C16.6667 8.81944 16.0174 7.24653 14.7187 5.94792C13.4201 4.64931 11.8472 4 10 4C8.15278 4 6.57986 4.64931 5.28125 5.94792C3.98264 7.24653 3.33333 8.81944 3.33333 10.6667C3.33333 11.5396 3.48479 12.3505 3.78771 13.0994C4.09062 13.8483 4.50111 14.5074 5.01917 15.0769ZM10 11.2917C9.23931 11.2917 8.59778 11.0304 8.07542 10.5079C7.55292 9.98556 7.29167 9.34403 7.29167 8.58333C7.29167 7.82264 7.55292 7.18111 8.07542 6.65875C8.59778 6.13625 9.23931 5.875 10 5.875C10.7607 5.875 11.4022 6.13625 11.9246 6.65875C12.4471 7.18111 12.7083 7.82264 12.7083 8.58333C12.7083 9.34403 12.4471 9.98556 11.9246 10.5079C11.4022 11.0304 10.7607 11.2917 10 11.2917ZM10 18.5833C8.90069 18.5833 7.86944 18.3766 6.90625 17.9631C5.94306 17.5497 5.10521 16.9866 4.39271 16.274C3.68007 15.5615 3.11701 14.7236 2.70354 13.7604C2.29007 12.7972 2.08333 11.766 2.08333 10.6667C2.08333 9.56736 2.29007 8.53611 2.70354 7.57292C3.11701 6.60972 3.68007 5.77187 4.39271 5.05937C5.10521 4.34674 5.94306 3.78368 6.90625 3.37021C7.86944 2.95674 8.90069 2.75 10 2.75C11.0993 2.75 12.1306 2.95674 13.0937 3.37021C14.0569 3.78368 14.8948 4.34674 15.6073 5.05937C16.3199 5.77187 16.883 6.60972 17.2965 7.57292C17.7099 8.53611 17.9167 9.56736 17.9167 10.6667C17.9167 11.766 17.7099 12.7972 17.2965 13.7604C16.883 14.7236 16.3199 15.5615 15.6073 16.274C14.8948 16.9866 14.0569 17.5497 13.0937 17.9631C12.1306 18.3766 11.0993 18.5833 10 18.5833Z" fill="white"/>
                      </svg> : <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.94875 17.75C6.77181 17.75 6.63271 17.6899 6.53146 17.5698C6.43035 17.4496 6.37979 17.3201 6.37979 17.181C6.37979 17.1192 6.3925 17.0543 6.41792 16.9862C6.44333 16.9183 6.48778 16.8535 6.55125 16.7916L9.47271 13.8702C9.55076 13.7921 9.63437 13.735 9.72354 13.6987C9.81271 13.6623 9.90618 13.6441 10.004 13.6441C10.1017 13.6441 10.1939 13.6623 10.2804 13.6987C10.3669 13.735 10.4492 13.7921 10.5273 13.8702L13.4487 16.7916C13.5122 16.8536 13.5567 16.9186 13.5821 16.9866C13.6075 17.0548 13.6202 17.1199 13.6202 17.1819C13.6202 17.3181 13.5697 17.4469 13.4685 17.5681C13.3673 17.6894 13.2282 17.75 13.0513 17.75H6.94875ZM3.58979 3.58331H16.4102C16.8245 3.58331 17.1792 3.73081 17.4742 4.02581C17.7692 4.32081 17.9167 4.67547 17.9167 5.08977V14.5769C17.9167 14.9912 17.7692 15.3458 17.4742 15.6408C17.1792 15.9358 16.8245 16.0833 16.4102 16.0833H16.04C15.8368 16.0833 15.6431 16.0443 15.459 15.9662C15.2748 15.8883 15.1143 15.781 14.9775 15.6441L11.6025 12.2691C11.3889 12.0539 11.1439 11.8892 10.8675 11.7752C10.591 11.6612 10.3019 11.6041 10.0004 11.6041C9.69889 11.6041 9.40979 11.6612 9.13312 11.7752C8.85646 11.8892 8.61125 12.0539 8.3975 12.2691L5.0225 15.6441C4.88569 15.781 4.72521 15.8883 4.54104 15.9662C4.35687 16.0443 4.16319 16.0833 3.96 16.0833H3.58979C3.17549 16.0833 2.82083 15.9358 2.52583 15.6408C2.23083 15.3458 2.08333 14.9912 2.08333 14.5769V5.08977C2.08333 4.67547 2.23083 4.32081 2.52583 4.02581C2.82083 3.73081 3.17549 3.58331 3.58979 3.58331Z" fill="white"/>
                            </svg>

                      }

                      {message.role.charAt(0).toUpperCase() +
                        message.role.slice(1)}
                    </p>
                    <p className="text-sm lg:text-base font-normal">{message.content}</p>
                    <span className="text-xs text-gray-300 self-end ml-auto">
                      {moment(message.timestamp).format(
                        "MMM DD, YYYY, hh:mm A"
                      )}
                    </span>
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
