"use client";
import { getCallLogs } from "@/service/prservice";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const price: any = {
  azure: 15 / 1_000_000,
  deepgram: 0.0059 / 60,
  // "llama-3.1-70b-versatile": { input: 0, output: 0 },
  // "llama-3.1-8b-instant": { input: 0.05, output: 0.08 },
  // "llama3-70b-8192": { input: 0.59, output: 0.59 },
  // "llama3-8b-8192": { input: 0.05, output: 0.08 },
  // "mixtral-8x7b-32768": { input: 0.24, output: 0.24 },
  // "gemma-7b-it": { input: 0.07, output: 0.07 },
  // "gemma2-9b-it": { input: 0.2, output: 0.2 },
  // "llama3-groq-70b-8192-tool-use-preview": { input: 0.89, output: 0.89 },
  // "llama3-groq-8b-8192-tool-use-preview": { input: 0.19, output: 0.19 },
  // "llama-guard-3-8b": { input: 0.2, output: 0.2 },
};

const PromptModify = () => {
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  const [totalCount, setTotalCount] = useState<number>(0);
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const disableNextButton = currentPage === totalPages;
  const disablePreviousButton = currentPage === 1;
  type Pricing = {
    input: number;
    output: number;
  };

  useEffect(() => {
    setLoading(true);
    getCallLogs({ page: currentPage, limit: itemsPerPage })
      .then((res) => {
        setCallLogs(res.callData);
        setTotalCount(res.totalCount);
      })
      .finally(() => setLoading(false));
  }, [currentPage, itemsPerPage]);

  // Handle pagination button clicks
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  function timeStringToSeconds(timeString: string) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  function getDuration(callData: any) {
    const startTime = new Date(callData.createdAt).getTime();
    const endTime = new Date(callData.call_end_time || callData.last_activity).getTime();
  
    // Check if dates are valid
    if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
      return "00:00:00";
    }
  
    const timediffence = endTime - startTime;
    const totalSeconds = Math.floor(timediffence / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  

  function calculateGroqCost(
    model: string,
    groqInputTokens: number,
    groqOutputTokens: number
  ) {
    const llmPrice: { [key: string]: Pricing } = {
      "llama-3.1-70b-versatile": { input: 0.59, output: 0.79 },
      "llama-3.1-8b-instant": { input: 0.05, output: 0.08 },
      "llama3-70b-8192": { input: 0.59, output: 0.79 },
      "llama3-8b-8192": { input: 0.05, output: 0.08 },
      "mixtral-8x7b-32768": { input: 0.24, output: 0.24 },
      "gemma-7b-it": { input: 0.07, output: 0.07 },
      "gemma2-9b-it": { input: 0.2, output: 0.2 },
      "llama3-groq-70b-8192-tool-use-preview": { input: 0.89, output: 0.89 },
      "llama3-groq-8b-8192-tool-use-preview": { input: 0.19, output: 0.19 },
      "llama-guard-3-8b": { input: 0.2, output: 0.2 },
    };

    // Retrieve the pricing for the selected model
    const modelPrice = llmPrice[model];

    if (!modelPrice) {
      throw new Error("Model not found");
    }

    // Calculate input and output costs
    const groqInputCost = (groqInputTokens / 1_000_000) * modelPrice.input;
    const groqOutputCost = (groqOutputTokens / 1_000_000) * modelPrice.output;

    return { groqInputCost, groqOutputCost };
  }

  return (
    <div className="w-9/12 flex-grow max-h-[98dvh] overflow-auto">
      <Table
        aria-label="Example static collection table"
        className="bg-black shadow p-4  border border-[#464646]"
      >
        <TableHeader>
          <TableColumn className="text-left mb-2 pb-2 border-b border-white text-sm">
            Call Id
          </TableColumn>
          <TableColumn className="text-left mb-2 pb-2 border-b border-white text-sm">
            Call Times & Duration
          </TableColumn>
          <TableColumn className="text-left mb-2 pb-2 border-b border-white text-sm">
            Azure Cost
          </TableColumn>
          <TableColumn className="text-left mb-2 pb-2 border-b border-white text-sm">
            Groq Input Cost
          </TableColumn>
          <TableColumn className="text-left mb-2 pb-2 border-b border-white text-sm">
            Groq Output Cost
          </TableColumn>
          <TableColumn className="text-left mb-2 pb-2 border-b border-white text-sm">
            DeepGram Cost
          </TableColumn>
          <TableColumn className="text-left mb-2 pb-2 border-b border-white text-sm">
            Total Cost
          </TableColumn>
        </TableHeader>
        <TableBody>
          {callLogs?.map((item: any) => {
            const azurePrize = (item.character_count ?? 0) * price.azure;

            const duration = item.call_duration || getDuration(item);
            const deepgramPrize =
              timeStringToSeconds(duration) * price.deepgram;
            const { groqInputCost, groqOutputCost } = calculateGroqCost(
              item?.completion_model,
              item.groq_input_tokens ?? 0,
              item.groq_output_tokens ?? 0
            );
            const totalCost =
              azurePrize + deepgramPrize + groqInputCost + groqOutputCost;
            return (
              <TableRow key={item._id} className="group">
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top group-hover:text-white transition-all duration-200 ease-linear">
                  {item._id}
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top group-hover:text-white transition-all duration-200 ease-linear">
                  {moment(item.createdAt).format("MMM DD, YYYY, hh:mm A")} -{" "}
                  {moment(item.call_end_time || item.last_activity).format(
                    "MMM DD, YYYY, hh:mm A"
                  )}{" "}
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top group-hover:text-white transition-all duration-200 ease-linear">
                  ${azurePrize.toFixed(3)}({item.character_count})
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top group-hover:text-white transition-all duration-200 ease-linear">
                  ${groqInputCost.toFixed(6)} ({item.groq_input_tokens ?? 0})
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top group-hover:text-white transition-all duration-200 ease-linear">
                  ${groqOutputCost.toFixed(6)} ({item.groq_output_tokens ?? 0})
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top group-hover:text-white transition-all duration-200 ease-linear">
                  ${deepgramPrize.toFixed(3)} ({item.call_duration || duration})
                </TableCell>
                <TableCell className="text-[#9ca5ad] group-hover:text-white xl:text-sm text-xs align-top transition-all duration-200 ease-linear">
                  <div className="flex justify-between">
                    <div>${totalCost.toFixed(4)}</div>{" "}
                    <Link
                      href={`/dashboard/calllogs/callConversation/${item._id}`}
                      className="inline-flex gap-3 transition-all duration-200 ease-linear"
                    >
                      View chats
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.03208 15.25L3.36375 16.9181C3.12667 17.1553 2.85396 17.2091 2.54562 17.0794C2.23743 16.9495 2.08333 16.7158 2.08333 16.3781V4.25646C2.08333 3.83549 2.22917 3.47917 2.52083 3.1875C2.8125 2.89583 3.16882 2.75 3.58979 2.75H16.4102C16.8312 2.75 17.1875 2.89583 17.4792 3.1875C17.7708 3.47917 17.9167 3.83549 17.9167 4.25646V13.7435C17.9167 14.1645 17.7708 14.5208 17.4792 14.8125C17.1875 15.1042 16.8312 15.25 16.4102 15.25H5.03208ZM4.5 14H16.4102C16.4744 14 16.5331 13.9733 16.5865 13.9198C16.6399 13.8665 16.6667 13.8077 16.6667 13.7435V4.25646C16.6667 4.19229 16.6399 4.13354 16.5865 4.08021C16.5331 4.02674 16.4744 4 16.4102 4H3.58979C3.52562 4 3.46687 4.02674 3.41354 4.08021C3.36007 4.13354 3.33333 4.19229 3.33333 4.25646V15.154L4.5 14ZM5.83333 12.125H10.8333C11.0107 12.125 11.1592 12.0651 11.2787 11.9454C11.3985 11.8258 11.4583 11.6774 11.4583 11.5C11.4583 11.3226 11.3985 11.1742 11.2787 11.0546C11.1592 10.9349 11.0107 10.875 10.8333 10.875H5.83333C5.65597 10.875 5.5075 10.9349 5.38792 11.0546C5.26819 11.1742 5.20833 11.3226 5.20833 11.5C5.20833 11.6774 5.26819 11.8258 5.38792 11.9454C5.5075 12.0651 5.65597 12.125 5.83333 12.125ZM5.83333 9.625H14.1667C14.344 9.625 14.4925 9.56514 14.6121 9.44542C14.7318 9.32583 14.7917 9.17736 14.7917 9C14.7917 8.82264 14.7318 8.67417 14.6121 8.55458C14.4925 8.43486 14.344 8.375 14.1667 8.375H5.83333C5.65597 8.375 5.5075 8.43486 5.38792 8.55458C5.26819 8.67417 5.20833 8.82264 5.20833 9C5.20833 9.17736 5.26819 9.32583 5.38792 9.44542C5.5075 9.56514 5.65597 9.625 5.83333 9.625ZM5.83333 7.125H14.1667C14.344 7.125 14.4925 7.06514 14.6121 6.94542C14.7318 6.82583 14.7917 6.67736 14.7917 6.5C14.7917 6.32264 14.7318 6.17417 14.6121 6.05458C14.4925 5.93486 14.344 5.875 14.1667 5.875H5.83333C5.65597 5.875 5.5075 5.93486 5.38792 6.05458C5.26819 6.17417 5.20833 6.32264 5.20833 6.5C5.20833 6.67736 5.26819 6.82583 5.38792 6.94542C5.5075 7.06514 5.65597 7.125 5.83333 7.125Z"
                          fill="#9CA5AD"
                          className="group-hover:fill-white transition-all duration-200 ease-linear"
                        />
                      </svg>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePrevPage}
          disabled={disablePreviousButton}
          className={disablePreviousButton ? "text-slate-700" : ""}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          onClick={handleNextPage}
          disabled={disableNextButton}
          className={disableNextButton ? "text-slate-700" : ""}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PromptModify;
