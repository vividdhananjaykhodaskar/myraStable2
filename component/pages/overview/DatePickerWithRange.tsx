"use client";

import * as React from "react";
import { addMonths, endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({ date, setDate }: any) {
  const handleNextMonth = () => {
    if (date?.from) {
      const nextMonth = addMonths(date.from, 1);
      setDate({
        from: startOfMonth(nextMonth),
        to: endOfMonth(nextMonth),
      });
    }
  };

  const handlePreviousMonth = () => {
    if (date?.from) {
      const previousMonth = addMonths(date.from, -1);
      setDate({
        from: startOfMonth(previousMonth),
        to: endOfMonth(previousMonth),
      });
    }
  };

  const isNextMonthDisabled = isSameMonth(date?.from, new Date());

  return (
    <div className={cn("grid gap-4 grid-cols-2 max-w-md	relative")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
      <div className="flex gap-1">
        <Button variant="outline" onClick={handlePreviousMonth} className="px-2 border-none bg-transparent">
          <ChevronLeft /> 
        </Button>
        <Button variant="outline" onClick={handleNextMonth} disabled={isNextMonthDisabled} className="px-2 border-none bg-transparent">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
