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
  "gemma2-9b-it": { input: 0.2, output: 0.2 },
  "gemma-7b-it": { input: 0.07, output: 0.07 },
  "llama-3.1-70b-versatile": { input: 0, output: 0 },
  "llama-3.1-8b-instant": { input: 0.05, output: 0.08 },
  "llama3-70b-8192": { input: 0.59, output: 0.59 },
  "llama3-8b-8192": { input: 0.05, output: 0.08 },
  "llama-guard-3-8b": { input: 0.2, output: 0.2 },
  "llama3-groq-70b-8192-tool-use-preview": { input: 0.89, output: 0.89 },
  "llama3-groq-8b-8192-tool-use-preview": { input: 0.19, output: 0.19 },
  "mixtral-8x7b-32768": { input: 0.24, output: 0.24 },
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

  useEffect(() => {
    setLoading(true);
    getCallLogs({ page: currentPage, limit: itemsPerPage }).then((res) => {
      setCallLogs(res.callData);
      setTotalCount(res.totalCount);
    }).finally(()=>setLoading(false));
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
    const currentTime = new Date(
      callData.call_end_time || callData.last_activity
    ).getTime();
    const timediffence = currentTime - new Date(callData.createdAt).getTime();
    const totalSeconds = Math.floor(timediffence / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function calculateGroqCost(
    model: string,
    groqInputTokens: number,
    groqOutputTokens: number
  ) {
    if (!price[model]) {
      throw new Error("Model not found in the pricing list");
    }

    const { input: inputCostPerMillion, output: outputCostPerMillion } =
      price[model];

    const groqInputCost = (groqInputTokens / 1_000_000) * inputCostPerMillion;
    const groqOutputCost =
      (groqOutputTokens / 1_000_000) * outputCostPerMillion;

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
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top">
                  {item._id}
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top">
                  {moment(item.createdAt).format("MMM DD, YYYY, hh:mm A")} -{" "}
                  {moment(item.call_end_time || item.last_activity).format(
                    "MMM DD, YYYY, hh:mm A"
                  )}{" "}
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top">
                  ${azurePrize.toFixed(3)}({item.character_count})
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top">
                  ${groqInputCost.toFixed(4)} ({item.groq_input_tokens ?? 0})
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top">
                  ${groqOutputCost.toFixed(4)} ({item.groq_output_tokens ?? 0})
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top">
                  ${deepgramPrize.toFixed(3)} ({item.call_duration || duration})
                </TableCell>
                <TableCell className="text-[#9ca5ad] xl:text-sm text-xs align-top">
                  <div className="flex justify-between">
                    <div>${totalCost.toFixed(4)}</div>{" "}
                    <Link
                      href={`/dashboard/calllogs/callConversation/${item._id}`}
                      className="transition-opacity duration-200 opacity-0  group-hover:opacity-100"
                    >
                      Call Logs
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
