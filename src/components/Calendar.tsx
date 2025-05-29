/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EntryModal from "./EntryModal";
import { dailyTaskService } from "@/lib/dailyTaskService";
import { useToast } from "../hooks/use-toast";

interface Meeting {
  title: string;
  time?: string;
  notes?: string;
}

interface Task {
  caption: string;
  url?: string;
}

interface Entry {
  id: string;
  date: string;
  meetings: Meeting[];
  tasks: Task[];
  mood: string;
  journalNotes: string;
  summary?: string;
}

interface CalendarEntry {
  date: string;
  hasEntry: boolean;
  entry?: Entry;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, CalendarEntry>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchMonthData = async (date: Date) => {
      try {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const formattedStartDate = `${year}-${month}-01`;
        const formattedEndDate = `${year}-${month}-${getDaysInMonth(date)}`;

        // Check if start date is in the future
        const startDate = new Date(formattedStartDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

        if (startDate > today) {
          // All dates will be disabled, so don't call API
          setEntries({});
          return;
        }

        const response = await dailyTaskService.getMonthlyTasks(
          formattedStartDate,
          formattedEndDate
        );
        const date_mapper: Record<string, CalendarEntry> = {};

        response.data.forEach((item: any) => {
          const dateString = new Date(item.date).toISOString().split("T")[0];
          date_mapper[dateString] = {
            date: dateString,
            hasEntry: true,
            entry: {
              id: item._id || item.id,
              date: item.date,
              meetings:
                item.meetings?.map((m: any) => ({
                  title: m.title,
                  time: m.time,
                  notes: m.notes,
                })) || [],
              tasks:
                item.tasks?.map((t: any) => ({
                  caption: t.caption,
                  url: t.url,
                })) || [],
              mood: item.mood || "neutral",
              journalNotes: item.journalNotes || "",
              summary: item.summary?.text || "",
            },
          };
        });
        setEntries(date_mapper);
      } catch (error) {
        console.error("Error fetching daily tasks:", error);
        toast({
          title: "Failed to fetch daily tasks",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    };

    fetchMonthData(currentDate);
  }, [currentDate, toast]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isDateInFuture = (date: string) => {
    return new Date(date) > today;
  };

  const isToday = (date: string) => {
    return date === todayString;
  };

  const handleDateClick = (date: string) => {
    if (isDateInFuture(date)) return;

    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getDayStatus = (date: string) => {
    if (isDateInFuture(date)) return "future";
    if (isToday(date)) return "today";
    return entries[date]?.hasEntry ? "hasEntry" : "noEntry";
  };

  const getDayClassName = (status: string) => {
    const baseClasses =
      "w-full h-16 p-2 border rounded-lg transition-all duration-200 flex flex-col justify-between relative";

    switch (status) {
      case "future":
        return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
      case "today":
        return `${baseClasses} bg-blue-50 border-blue-300 text-blue-900 cursor-pointer hover:bg-blue-100 shadow-md`;
      case "hasEntry":
        return `${baseClasses} bg-green-50 border-green-300 text-green-900 cursor-pointer hover:bg-green-100`;
      case "noEntry":
        return `${baseClasses} bg-red-50 border-red-300 text-red-900 cursor-pointer hover:bg-red-100`;
      default:
        return baseClasses;
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const status = getDayStatus(date);
      const entry = entries[date];

      days.push(
        <div
          key={date}
          className={getDayClassName(status)}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">{day}</span>
            {status === "today" && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                Today
              </Badge>
            )}
          </div>

          {entry?.hasEntry && (
            <div className="flex items-center justify-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}

          {status === "today" && !entry?.hasEntry && (
            <div className="absolute bottom-1 right-1">
              <Plus className="w-3 h-3 text-blue-600" />
            </div>
          )}

          {entry?.hasEntry && !isDateInFuture(date) && (
            <div className="absolute bottom-1 right-1">
              <Edit3 className="w-3 h-3 text-green-600" />
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSaveEntry = (entryData: Omit<Entry, "id" | "summary">) => {
    if (!selectedDate) return;

    const newEntry: Entry = {
      ...entryData,
      id: Date.now().toString(), // Simple ID generation
      summary: undefined,
    };

    setEntries((prev) => ({
      ...prev,
      [selectedDate]: {
        date: selectedDate,
        hasEntry: true,
        entry: newEntry,
      },
    }));
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="h-full bg-white">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Life Calendar
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[140px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">Has Entry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">No Entry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">Future (Disabled)</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-[calc(100%-140px)]">
          <div className="h-full flex flex-col">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-50 rounded"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 flex-1">
              {renderCalendarDays()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry Modal */}
      {isModalOpen && selectedDate && (
        <EntryModal
          entry={entries[selectedDate]?.entry || null}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
          }}
          onSave={handleSaveEntry}
        />
      )}
    </div>
  );
};

export default Calendar;
