/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Edit3, Calendar as CalendarIcon, AlignRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EntryModal from "./EntryModal";
import EntryDetailModal from "./dashboard/EntryDetailModal";
import Loader from "@/components/ui/loader";
import { dailyTaskService } from "@/lib/dailyTaskService";
import { useToast } from "../hooks/use-toast";
import { Meeting, Task, Entry } from "@/types";

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchMonthData = async (date: Date) => {
      setIsLoading(true);
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
              date: item.date ? new Date(item.date).toISOString().split("T")[0] : dateString,
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
              summary: typeof item.summary === 'string' 
                ? item.summary 
                : (item.summary?.content || item.summary?.text || ""),
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
      } finally {
        setIsLoading(false);
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
    const entry = entries[date];
    
    if (entry?.hasEntry && entry.entry) {
      // If there's an existing entry, show detail modal first
      setSelectedEntry(entry.entry);
      setIsDetailModalOpen(true);
    } else {
      // If no entry exists, open the edit modal directly
      setIsModalOpen(true);
    }
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

  const getMoodEmoji = (mood: string) => {
    switch(mood?.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'neutral': return '😐';
      case 'excited': return '🤩';
      case 'motivated': return '💪';
      case 'stressed': return '😤';
      case 'calm': return '😌';
      case 'fun': return '🎉';
      case 'anxious': return '😰';
      case 'grateful': return '🙏';
      case 'productive': return '✅';
      case 'tired': return '😴';
      case 'other': return '🤔';
      default: return '';
    }
  };

  const getDayStatus = (date: string) => {
    if (isDateInFuture(date)) return "future";
    if (isToday(date)) return "today";
    return entries[date]?.hasEntry ? "hasEntry" : "noEntry";
  };

  const getTaskSummary = (tasks: Task[] | undefined) => {
    if (!tasks || tasks.length === 0) return null;
    return (
      <Badge variant="outline" className="text-xs px-1 py-0 border-amber-200 text-amber-800">
        {tasks.length} task{tasks.length > 1 ? 's' : ''}
      </Badge>
    );
  };

  const hasJournalContent = (notes: string | undefined) => {
    return notes && notes.trim().length > 0;
  };

  const getDayClassName = (status: string) => {
    const baseClasses =
      "w-full h-20 p-2 sm:p-2 p-1 border rounded-lg transition-all duration-200 flex flex-col justify-between relative";

    switch (status) {
      case "future":
        return `${baseClasses} bg-gray-50 text-gray-400 cursor-not-allowed opacity-60`;
      case "today":
        return `${baseClasses} bg-blue-50 border-blue-400 text-blue-900 cursor-pointer hover:bg-blue-100 shadow-md transform hover:scale-[1.03] hover:shadow-lg`;
      case "hasEntry":
        return `${baseClasses} bg-white border-green-200 text-slate-800 cursor-pointer hover:bg-green-50 hover:border-green-300 transform hover:scale-[1.03] hover:shadow-sm`;
      case "noEntry":
        return `${baseClasses} bg-white border-gray-200 text-slate-800 cursor-pointer hover:bg-gray-50 transform hover:scale-[1.03]`;
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
      days.push(<div key={`empty-${i}`} className="h-20"></div>);
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
      const moodEmoji = entry?.entry?.mood ? getMoodEmoji(entry.entry.mood) : '';

      days.push(
        <div
          key={date}
          className={getDayClassName(status)}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex justify-between items-start">
            <span className={`font-medium rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm ${status === 'today' ? 'bg-blue-500 text-white' : ''}`}>
              {day}
            </span>
            {status === "today" && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 py-0 sm:px-1.5 sm:py-0.5 bg-blue-100 text-blue-800 rounded-full hidden xs:inline-flex">
                Today
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-0.5 mt-1">
            {entry?.hasEntry && (
              <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                {moodEmoji && <span className="text-lg sm:text-xl leading-none">{moodEmoji}</span>}
                
                {/* Show meeting indicator with count */}
                {entry.entry?.meetings && entry.entry.meetings.length > 0 && (
                  <Badge variant="outline" className="text-[10px] sm:text-xs px-1 py-0 border-blue-200 text-blue-800 hidden xs:inline-flex">
                    {entry.entry.meetings.length}
                  </Badge>
                )}
                
                {/* Show task indicator with count */}
                {entry.entry?.tasks && entry.entry.tasks.length > 0 && 
                  <span className="xs:hidden inline-flex">
                    <Badge variant="outline" className="text-[10px] px-1 py-0 border-amber-200 text-amber-800">
                      {entry.entry.tasks.length}
                    </Badge>
                  </span>
                }
                
                {entry.entry?.tasks && entry.entry.tasks.length > 0 && 
                  <span className="hidden xs:inline-flex">
                    {getTaskSummary(entry.entry.tasks)}
                  </span>
                }
                
                {/* Show journal indicator */}
                {hasJournalContent(entry.entry?.journalNotes) && (
                  <span className="ml-auto text-gray-500">
                    <MessageSquare className="h-3 w-3" />
                  </span>
                )}
              </div>
            )}

            {status === "today" && !entry?.hasEntry && (
              <div className="absolute bottom-2 right-2 bg-blue-100 rounded-full p-1 shadow-sm hover:bg-blue-200">
                <Plus className="w-3 h-3 text-blue-600" />
              </div>
            )}

            {entry?.hasEntry && !isDateInFuture(date) && (
              <div className="absolute bottom-2 right-2 bg-green-100 rounded-full p-1 shadow-sm hover:bg-green-200">
                <Edit3 className="w-3 h-3 text-green-600" />
              </div>
            )}
          </div>
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

  // Add today button functionality
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Add mood colors for the detail modal
  const moodColors = {
    happy: 'bg-yellow-100 text-yellow-800',
    sad: 'bg-gray-100 text-gray-800',
    neutral: 'bg-gray-100 text-gray-800',
    excited: 'bg-purple-100 text-purple-800',
    motivated: 'bg-green-100 text-green-800',
    stressed: 'bg-red-100 text-red-800',
    calm: 'bg-blue-100 text-blue-800',
    fun: 'bg-pink-100 text-pink-800',
    anxious: 'bg-orange-100 text-orange-800',
    grateful: 'bg-lime-100 text-lime-800',
    productive: 'bg-green-100 text-green-800',
    tired: 'bg-slate-100 text-slate-800',
    other: 'bg-indigo-100 text-indigo-800',
  };

  // Handler for editing from detail modal
  const handleEditFromDetail = (entry: Entry) => {
    setIsDetailModalOpen(false);
    setSelectedEntry(null);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white">
      <Card className="h-full border-none shadow-sm">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              <span>Life Calendar</span>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="h-7 sm:h-8 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
              >
                Today
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3 bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600"
                  disabled={isLoading}
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <h2 className="text-sm sm:text-lg font-semibold min-w-[90px] sm:min-w-[140px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600"
                  disabled={isLoading}
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>

          {!isLoading && (
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-4 p-2 sm:p-4 bg-white rounded-xl shadow-sm text-[10px] sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">Has Entry</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">No Entry</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 sm:gap-2 opacity-60">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-200 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-500">Future</span>
              </div>
              <div className="ml-auto hidden sm:flex gap-4">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Journal Entry</span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="h-[calc(100%-140px)] px-1 sm:px-4 pb-1 sm:pb-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader 
                size="lg" 
                text="Loading calendar..." 
                variant="spinner" 
              />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="h-6 sm:h-8 flex items-center justify-center text-[10px] sm:text-sm font-medium text-gray-500"
                  >
                    {window.innerWidth < 640 ? day.charAt(0) : day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
                {renderCalendarDays()}
              </div>
            </div>
          )}
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

      {/* Entry Detail Modal */}
      {isDetailModalOpen && selectedEntry && (
        <EntryDetailModal
          entry={selectedEntry}
          moodColors={moodColors}
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEntry(null);
          }}
          onEdit={handleEditFromDetail}
        />
      )}
    </div>
  );
};

// Create a custom hook for device width detection
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default Calendar;
