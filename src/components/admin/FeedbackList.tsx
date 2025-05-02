
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Eye } from "lucide-react";
import { FeedbackItem } from "@/types/feedback";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SocialShareButtons from "@/components/feedback/SocialShareButtons";

interface FeedbackListProps {
  isLoading: boolean;
  filteredFeedback: FeedbackItem[];
  selectedRows: string[];
  handleRowSelect: (id: string) => void;
  handleSelectAll: () => void;
  handleUpdateStatus: (id: string, status: string) => Promise<void>;
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
  // Get average rating helper function
  const getAverageRating = (item: FeedbackItem) => {
    const ratings = Object.values(item.ratings);
    return ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 'N/A';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let variant;
    switch (status) {
      case 'new':
        variant = 'default';
        break;
      case 'in-progress':
        variant = 'secondary';
        break;
      case 'resolved':
        variant = 'outline';
        break;
      default:
        variant = 'outline';
    }
    
    const baseClasses = 'px-2 py-1 rounded-md text-xs font-medium';
    let colorClasses = '';
    
    switch (status) {
      case 'new':
        colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        break;
      case 'in-progress':
        colorClasses = 'bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-blue-100';
        break;
      case 'resolved':
        colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        break;
      default:
        colorClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
    
    return (
      <span className={`${baseClasses} ${colorClasses}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full bg-blue-50 dark:bg-blue-900/30" />
        <Skeleton className="h-20 w-full bg-blue-50 dark:bg-blue-900/30" />
        <Skeleton className="h-20 w-full bg-blue-50 dark:bg-blue-900/30" />
        <Skeleton className="h-20 w-full bg-blue-50 dark:bg-blue-900/30" />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-blue-100 dark:border-blue-800">
      <Table>
        <TableHeader className="bg-blue-50/50 dark:bg-blue-900/20">
          <TableRow className="border-blue-100 dark:border-blue-800">
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectedRows.length === filteredFeedback.length && filteredFeedback.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className="border-blue-300 dark:border-blue-700"
              />
            </TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFeedback.length === 0 ? (
            <TableRow className="border-blue-100 dark:border-blue-800">
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No feedback entries found
              </TableCell>
            </TableRow>
          ) : (
            filteredFeedback.map((item) => (
              <TableRow key={item.id} className="border-blue-100 dark:border-blue-800">
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.includes(item.id)}
                    onCheckedChange={() => handleRowSelect(item.id)}
                    aria-label={`Select feedback from ${item.name}`}
                    className="border-blue-300 dark:border-blue-700"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-blue-900 dark:text-blue-100">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.email}</div>
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {item.hotel_id || 'N/A'}
                </TableCell>
                <TableCell>
                  <span className="text-blue-700 dark:text-blue-300">{getAverageRating(item)}</span>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={item.status}
                    onValueChange={(value) => handleUpdateStatus(item.id, value)}
                  >
                    <SelectTrigger className="w-[130px] h-8 border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950 text-blue-900 dark:text-blue-100">
                      <SelectValue>
                        <StatusBadge status={item.status} />
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
                      onClick={() => exportSingleFeedback(item)}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedbackList;
