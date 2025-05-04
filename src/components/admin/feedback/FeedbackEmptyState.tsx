
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

const FeedbackEmptyState = () => {
  return (
    <TableRow className="border-blue-100 dark:border-blue-800">
      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
        No feedback entries found
      </TableCell>
    </TableRow>
  );
};

export default FeedbackEmptyState;
