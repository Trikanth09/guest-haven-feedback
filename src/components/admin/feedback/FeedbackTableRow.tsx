
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeedbackItem } from "@/types/feedback";
import StatusBadge from "./StatusBadge";
import SocialShareButtons from "@/components/feedback/SocialShareButtons";

interface FeedbackTableRowProps {
  item: FeedbackItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onExport: (item: FeedbackItem) => void;
  formatDate: (dateString: string) => string;
  getAverageRating: (item: FeedbackItem) => string;
}

const FeedbackTableRow = ({
  item,
  isSelected,
  onSelect,
  onUpdateStatus,
  onExport,
  formatDate,
  getAverageRating
}: FeedbackTableRowProps) => {
  return (
    <TableRow key={item.id} className="border-blue-100 dark:border-blue-800">
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect(item.id)}
          aria-label={`Select feedback from ${item.name}`}
          className="border-blue-300 dark:border-blue-700"
        />
      </TableCell>
      <TableCell>
        <div className="font-medium text-blue-900 dark:text-blue-100">{item.name}</div>
        <div className="text-sm text-muted-foreground">{item.email}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{item.hotel_name || 'Unknown Hotel'}</div>
        {item.room_number && (
          <div className="text-xs text-muted-foreground">Room: {item.room_number}</div>
        )}
      </TableCell>
      <TableCell>
        <span className="text-blue-700 dark:text-blue-300 font-medium">{getAverageRating(item)}</span>
      </TableCell>
      <TableCell>
        <div className="max-w-[200px] truncate" title={item.comments}>
          {item.comments}
        </div>
      </TableCell>
      <TableCell>
        <div title={new Date(item.created_at).toLocaleString()}>
          {formatDate(item.created_at)}
        </div>
      </TableCell>
      <TableCell>
        <Select
          defaultValue={item.status}
          onValueChange={(value) => onUpdateStatus(item.id, value)}
        >
          <SelectTrigger className="w-[130px] h-8 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950 text-blue-900 dark:text-blue-100">
            <SelectValue>
              <StatusBadge status={item.status || 'new'} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950">
            <SelectItem value="new">
              <StatusBadge status="new" />
            </SelectItem>
            <SelectItem value="in-progress">
              <StatusBadge status="in-progress" />
            </SelectItem>
            <SelectItem value="resolved">
              <StatusBadge status="resolved" />
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExport(item)}
            title="Export as PDF"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/30"
          >
            <FileDown className="h-4 w-4" />
          </Button>
          <SocialShareButtons feedbackItem={item} compact />
          <Button 
            variant="ghost" 
            size="icon" 
            title="View details"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/30"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FeedbackTableRow;
