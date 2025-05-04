
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { FeedbackItem } from "@/types/feedback";
import FeedbackTableHeader from "./FeedbackTableHeader";
import FeedbackTableRow from "./FeedbackTableRow";
import FeedbackEmptyState from "./FeedbackEmptyState";

interface FeedbackTableProps {
  filteredFeedback: FeedbackItem[];
  selectedRows: string[];
  handleRowSelect: (id: string) => void;
  handleSelectAll: () => void;
  handleUpdateStatus: (id: string, status: string) => Promise<void>;
  exportSingleFeedback: (item: FeedbackItem) => void;
  getAverageRating: (item: FeedbackItem) => string;
  formatDate: (dateString: string) => string;
}

const FeedbackTable = ({
  filteredFeedback,
  selectedRows,
  handleRowSelect,
  handleSelectAll,
  handleUpdateStatus,
  exportSingleFeedback,
  getAverageRating,
  formatDate
}: FeedbackTableProps) => {
  return (
    <div className="rounded-md border border-blue-100 dark:border-blue-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <FeedbackTableHeader 
            allSelected={selectedRows.length === filteredFeedback.length} 
            onSelectAll={handleSelectAll}
            hasFeedback={filteredFeedback.length > 0}
          />
          <TableBody>
            {filteredFeedback.length === 0 ? (
              <FeedbackEmptyState />
            ) : (
              filteredFeedback.map((item) => (
                <FeedbackTableRow
                  key={item.id}
                  item={item}
                  isSelected={selectedRows.includes(item.id)}
                  onSelect={handleRowSelect}
                  onUpdateStatus={handleUpdateStatus}
                  onExport={exportSingleFeedback}
                  formatDate={formatDate}
                  getAverageRating={getAverageRating}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeedbackTable;
