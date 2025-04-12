
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, RefreshCw, FileDown, Download } from "lucide-react";
import { FeedbackFilterOptions } from "@/types/feedback";
import { toast } from "@/hooks/use-toast";

interface FilterBarProps {
  filters: FeedbackFilterOptions;
  setFilters: (filters: FeedbackFilterOptions) => void;
  resetFilters: () => void;
  exportSelectedFeedback: () => void;
  backupFeedback: () => void;
  selectedRows: string[];
  isExporting: boolean;
  isBackingUp: boolean;
  feedbackLength: number;
  lastBackup: string | null;
}

const FilterBar = ({
  filters,
  setFilters,
  resetFilters,
  exportSelectedFeedback,
  backupFeedback,
  selectedRows,
  isExporting,
  isBackingUp,
  feedbackLength,
  lastBackup,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          <Input
            placeholder="Search by guest name or feedback content"
            className="pl-8 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="w-[150px]">
            <Select 
              value={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        
        <Button 
          variant="outline"
          onClick={exportSelectedFeedback}
          disabled={selectedRows.length === 0 || isExporting}
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button
          variant="outline"
          onClick={backupFeedback}
          disabled={isBackingUp || feedbackLength === 0}
          title={lastBackup ? `Last backup: ${new Date(lastBackup).toLocaleString()}` : ''}
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Backup
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
