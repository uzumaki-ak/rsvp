"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  created_at: string;
  slug: string;
  stats?: {
    totalResponses: number;
    attending: number;
    maybe: number;
    notAttending: number;
  };
}

// Simple Select component
const SimpleSelect = ({ value, onValueChange, options, className, placeholder }: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface EventsTableProps {
  events: Event[];
  totalEvents: number;
  totalResponses: number;
  totalAttending: number;
  totalMaybe: number;
}

export default function EventsTable({ 
  events: initialEvents,
  totalEvents,
  totalResponses,
  totalAttending,
  totalMaybe
}: EventsTableProps) {
  const [events] = useState<Event[]>(initialEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at_desc");

  const eventsPerPage = 10;

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date);
        switch (dateFilter) {
          case "upcoming":
            return eventDate > now;
          case "past":
            return eventDate < now;
          case "today":
            return eventDate.toDateString() === now.toDateString();
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "date_asc":
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        case "date_desc":
          return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
        case "created_at_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "created_at_desc":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [events, searchQuery, dateFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      {/* Filters and Search */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search by title or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400 z-10" />
              <SimpleSelect
                value={dateFilter}
                onValueChange={setDateFilter}
                options={[
                  { value: "all", label: "All Dates" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "past", label: "Past Events" },
                  { value: "today", label: "Today" },
                ]}
                className="pl-10"
              />
            </div>

            <SimpleSelect
              value={sortBy}
              onValueChange={setSortBy}
              options={[
                { value: "created_at_desc", label: "Newest First" },
                { value: "created_at_asc", label: "Oldest First" },
                { value: "title_asc", label: "Title A-Z" },
                { value: "title_desc", label: "Title Z-A" },
                { value: "date_asc", label: "Event Date (Asc)" },
                { value: "date_desc", label: "Event Date (Desc)" },
              ]}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700">
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Title
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Description
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Event Date
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Created At
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Responses
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Attending
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Maybe
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Not Attending
                </th>
                <th className="text-left p-4 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-stone-100 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-stone-900 dark:text-white">
                        {event.title}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-stone-600 dark:text-stone-400 max-w-xs truncate">
                        {event.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        {new Date(event.event_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        {new Date(event.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center font-medium text-blue-600 dark:text-blue-400">
                        {event.stats?.totalResponses || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center font-medium text-green-600 dark:text-green-400">
                        {event.stats?.attending || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center font-medium text-amber-600 dark:text-amber-400">
                        {event.stats?.maybe || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center font-medium text-red-600 dark:text-red-400">
                        {event.stats?.notAttending || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link href={`/events/${event.slug}/admin`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-16 w-16 text-stone-300 dark:text-stone-600 mb-4" />
                      <p className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                        {searchQuery || dateFilter !== "all" ? "No matching events found" : "No events yet"}
                      </p>
                      <p className="text-stone-600 dark:text-stone-400 mb-4">
                        {searchQuery || dateFilter !== "all" 
                          ? "Try adjusting your search or filters"
                          : "Create your first event to start managing RSVPs"}
                      </p>
                      {!searchQuery && dateFilter === "all" && (
                        <Link href="/create">
                          <Button className="bg-amber-600 hover:bg-amber-700">
                            Create Event
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet View - Cards */}
        <div className="md:hidden">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <div
                key={event.id}
                className="border-b border-stone-200 dark:border-stone-700 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-stone-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  <Link href={`/events/${event.slug}/admin`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-stone-300 dark:border-stone-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Event Date</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300">
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Created</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {event.stats?.totalResponses || 0}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">Total</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {event.stats?.attending || 0}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">Going</div>
                  </div>
                  <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {event.stats?.maybe || 0}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">Maybe</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                      {event.stats?.notAttending || 0}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">No</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="h-16 w-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-stone-900 dark:text-white mb-2">
                {searchQuery || dateFilter !== "all" ? "No matching events" : "No events yet"}
              </p>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                {searchQuery || dateFilter !== "all" 
                  ? "Try adjusting your search"
                  : "Create your first event"}
              </p>
              {!searchQuery && dateFilter === "all" && (
                <Link href="/create">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Create Event
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} of{" "}
            {filteredEvents.length} events
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="border-stone-300 dark:border-stone-700"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-stone-300 dark:border-stone-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[40px] ${
                      currentPage === pageNum
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "border-stone-300 dark:border-stone-700"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-stone-300 dark:border-stone-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="border-stone-300 dark:border-stone-700"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}