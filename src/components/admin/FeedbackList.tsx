
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Printer } from "lucide-react";
import { FeedbackItem } from "@/types/feedback";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FeedbackListProps {
  isLoading: boolean;
  filteredFeedback: FeedbackItem[];
  selectedRows: string[];
  handleRowSelect: (id: string) => void;
  handleSelectAll: () => void;
  handleUpdateStatus: (id: string, status: string) => void;
  exportSingleFeedback: (item: FeedbackItem) => void;
}

const FeedbackList = ({
  isLoading,
  filteredFeedback,
  selectedRows,
  handleRowSelect,
  handleSelectAll,
  handleUpdateStatus,
  exportSingleFeedback,
}: FeedbackListProps) => {
  return (
    <div className="rounded-md border dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 dark:bg-gray-800">
            <TableRow className="dark:border-gray-700">
              <TableHead className="w-8">
                <input
                  type="checkbox"
                  checked={
                    filteredFeedback.length > 0 &&
                    selectedRows.length === filteredFeedback.length
                  }
                  onChange={handleSelectAll}
                  className="rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </TableHead>
              <TableHead className="dark:text-gray-300">Guest</TableHead>
              <TableHead className="dark:text-gray-300">Date</TableHead>
              <TableHead className="text-center dark:text-gray-300">Rating</TableHead>
              <TableHead className="dark:text-gray-300">Comments</TableHead>
              <TableHead className="text-center dark:text-gray-300">Status</TableHead>
              <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center dark:text-gray-300 dark:border-gray-700"
                >
                  Loading feedback data...
                </TableCell>
              </TableRow>
            ) : filteredFeedback.length > 0 ? (
              filteredFeedback.map((feedback) => {
                const ratings = Object.values(feedback.ratings);
                const avgRating =
                  ratings.reduce((a, b) => a + b, 0) / ratings.length;

                return (
                  <TableRow
                    key={feedback.id}
                    className="dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <TableCell className="dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(feedback.id)}
                        onChange={() => handleRowSelect(feedback.id)}
                        className="rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </TableCell>
                    <TableCell className="font-medium dark:text-gray-300">
                      <div>{feedback.name}</div>
                      <div className="text-xs text-muted-foreground dark:text-gray-400">
                        {feedback.email}
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center dark:text-gray-300">
                      <div className="flex items-center justify-center">
                        {avgRating.toFixed(1)}
                        <Star className="h-3.5 w-3.5 ml-1 text-hotel-gold fill-hotel-gold" />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs dark:text-gray-300">
                      <div className="truncate">{feedback.comments}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={feedback.status || "new"}
                        onValueChange={(value) =>
                          handleUpdateStatus(feedback.id, value)
                        }
                      >
                        <SelectTrigger className="h-7 w-32 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                          <SelectValue>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                feedback.status === "new"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : feedback.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              }`}
                            >
                              {feedback.status === "new"
                                ? "New"
                                : feedback.status === "in-progress"
                                ? "In Progress"
                                : "Resolved"}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportSingleFeedback(feedback)}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground dark:text-gray-400 dark:border-gray-700"
                >
                  No feedback found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeedbackList;
