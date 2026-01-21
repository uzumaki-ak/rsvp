"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RSVP {
  id: string;
  name: string;
  email: string;
  accompany: number;
  attendance: string;
  created_at: string;
  event_id: string;
}

interface RSVPTableProps {
  data: RSVP[];
}

export function RSVPTable({ data }: RSVPTableProps) {
  const [filter, setFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredData = React.useMemo(() => {
    let result = data.filter(
      (rsvp) =>
        rsvp.name.toLowerCase().includes(filter.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(filter.toLowerCase())
    );

    if (statusFilter !== "all") {
      result = result.filter((rsvp) => rsvp.attendance === statusFilter);
    }

    return result;
  }, [data, filter, statusFilter]);

  const getAttendanceBadge = (attendance: string) => {
    switch (attendance) {
      case "yes":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            ✓ Attending
          </span>
        );
      case "no":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            ✗ Not Attending
          </span>
        );
      case "maybe":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            ? Maybe
          </span>
        );
      default:
        return (
          <span className="text-stone-500 dark:text-stone-400">
            {attendance}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Guests", "Response", "Date"];
    const csvData = filteredData.map((rsvp) => [
      rsvp.name,
      rsvp.email,
      rsvp.accompany || 0,
      rsvp.attendance,
      formatDate(rsvp.created_at),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rsvp-data-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search by name or email..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className={
                statusFilter === "all"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "border-stone-300 dark:border-stone-700"
              }
            >
              All
            </Button>
            <Button
              variant={statusFilter === "yes" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("yes")}
              className={
                statusFilter === "yes"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "border-stone-300 dark:border-stone-700"
              }
            >
              Attending
            </Button>
            <Button
              variant={statusFilter === "maybe" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("maybe")}
              className={
                statusFilter === "maybe"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "border-stone-300 dark:border-stone-700"
              }
            >
              Maybe
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
          <span className="hidden sm:inline">
            Showing {filteredData.length} of {data.length} responses
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-50 dark:bg-stone-900/50">
            <TableRow className="hover:bg-stone-50 dark:hover:bg-stone-900/50 border-stone-200 dark:border-stone-700">
              <TableHead className="text-stone-700 dark:text-stone-300 font-medium">
                Name
              </TableHead>
              <TableHead className="text-stone-700 dark:text-stone-300 font-medium">
                Email
              </TableHead>
              <TableHead className="text-stone-700 dark:text-stone-300 font-medium">
                Guests
              </TableHead>
              <TableHead className="text-stone-700 dark:text-stone-300 font-medium">
                Response
              </TableHead>
              <TableHead className="text-stone-700 dark:text-stone-300 font-medium">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((rsvp) => (
                <TableRow
                  key={rsvp.id}
                  className="hover:bg-stone-50 dark:hover:bg-stone-900/30 border-stone-200 dark:border-stone-700"
                >
                  <TableCell className="font-medium text-stone-900 dark:text-white">
                    {rsvp.name}
                  </TableCell>
                  <TableCell className="text-stone-700 dark:text-stone-300">
                    {rsvp.email}
                  </TableCell>
                  <TableCell className="text-stone-700 dark:text-stone-300">
                    <div className="flex items-center">
                      <span className="font-medium">{rsvp.accompany || 0}</span>
                      <span className="text-stone-500 dark:text-stone-400 text-sm ml-1">
                        guest{rsvp.accompany !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getAttendanceBadge(rsvp.attendance)}</TableCell>
                  <TableCell className="text-stone-600 dark:text-stone-400 text-sm">
                    {formatDate(rsvp.created_at)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400">
                    <Search className="h-12 w-12 mb-3 opacity-20" />
                    <p className="font-medium">No RSVPs found</p>
                    <p className="text-sm mt-1">
                      {filter
                        ? "Try adjusting your search or filter"
                        : "No responses yet"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-stone-600 dark:text-stone-400">
          <div>
            Showing <span className="font-medium">{filteredData.length}</span>{" "}
            of <span className="font-medium">{data.length}</span> responses
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="mt-2 sm:mt-0 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
        </div>
      )}
    </div>
  );
}