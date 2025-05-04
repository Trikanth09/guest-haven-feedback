
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDownUp } from "lucide-react";

interface FeedbackTableHeaderProps {
  allSelected: boolean;
  onSelectAll: () => void;
  hasFeedback: boolean;
}

const FeedbackTableHeader = ({
  allSelected,
  onSelectAll,
  hasFeedback
}: FeedbackTableHeaderProps) => {
  return (
    <TableHeader className="bg-blue-50/50 dark:bg-blue-900/20">
      <TableRow className="border-blue-100 dark:border-blue-800">
        <TableHead className="w-[50px]">
          <Checkbox 
            checked={allSelected && hasFeedback}
            onCheckedChange={onSelectAll}
            aria-label="Select all"
            className="border-blue-300 dark:border-blue-700"
          />
        </TableHead>
        <TableHead>Guest</TableHead>
        <TableHead>Hotel</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead>Comment</TableHead>
        <TableHead>
          <div className="flex items-center">
            Date
            <ArrowDownUp className="ml-1 h-3 w-3" />
          </div>
        </TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default FeedbackTableHeader;
