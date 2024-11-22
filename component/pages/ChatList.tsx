import { Button } from "@nextui-org/react";
import React, { useRef, useState } from "react";

function ChatList({ messages, loadingRes }: { messages: any; loadingRes: boolean }) {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className={`flex justify-end absolute w-full transition-all duration-300 ease-linear ${visible ? "md:max-w-[50%] w-full lg:w-1/3 left-0 md:left-auto md:right-0 top-0" : "md:right-0 md:min-w-10 z-30 md:w-0 w-full md:top-0 top-[-62vh]"}`}>
        <Button className={`absolute z-50 bg-emerald-300 text-black font-semibold rounded-full md:top-4 md:bottom-auto md:-left-9 left-2/4 md:translate-x-0 -translate-x-2/4 w-fit bottom-2 transition-all duration-200 ease-linear ${visible ? "" : "md:right-4"}`} onClick={handleToggle}>
          {visible ? "Hide" : "Show"}
        </Button>
        
        <div className={`chatbot-container bg-[rgba(255,255,255,0.10)] overflow-hidden max-h-[75vh] lg:max-h-screen h-[75vh] lg:h-screen lg:rounded-tl-3xl rounded-bl-3xl rounded-br-3xl lg:rounded-br-none p-4 xl:p-6 xl:pr-4 xl:pt-16 ${visible ? "w-full md:translate-y-[initial] translate-y-0" : "md:translate-y-0 -translate-y-full md:w-0 w-full"}`}>
          <ul className="chatbot-messages w-full flex flex-col gap-3 overflow-x-hidden overflow-y-auto max-h-full pb-8 lg:pb-0">
            {messages.map((message: any, index: number) => {
              return (
                index != 0 && (
                  <li
                    key={index}
                    className={`flex-shrink-0 rounded-3xl py-3 px-4 bg-[rgba(255,255,255,0.07)] border-l-[3px] border-solid ${
                      message.role === "user" ? "user-message border-[rgba(255,255,255,0.15)]" : "bot-message text-green-300 border-green-300"
                    }`}
                  >
                    {message.content}
                  </li>
                )
              );
            })}
            {loadingRes && (
              <section className="dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </section>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ChatList;
