
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
    const variant = 
      status === 'new' ? 'default' : 
      status === 'in-progress' ? 'secondary' : 
      status === 'resolved' ? 'success' : 
      'outline';
    
    return <Badge variant={variant as any}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border dark:border-gray-700">
      <Table>
        <TableHeader className="bg-muted/50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectedRows.length === filteredFeedback.length && filteredFeedback.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className="dark:border-gray-600"
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
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground dark:text-gray-400">
                No feedback entries found
              </TableCell>
            </TableRow>
          ) : (
            filteredFeedback.map((item) => (
              <TableRow key={item.id} className="dark:border-gray-700">
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.includes(item.id)}
                    onCheckedChange={() => handleRowSelect(item.id)}
                    aria-label={`Select feedback from ${item.name}`}
                    className="dark:border-gray-600"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium dark:text-white">{item.name}</div>
                  <div className="text-sm text-muted-foreground dark:text-gray-400">{item.email}</div>
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {item.hotel_id || 'N/A'}
                </TableCell>
                <TableCell>
                  {getAverageRating(item)}
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={item.status}
                    onValueChange={(value) => handleUpdateStatus(item.id, value)}
                  >
                    <SelectTrigger className="w-[130px] h-8 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                      <SelectValue>
                        <StatusBadge status={item.status} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
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
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <SocialShareButtons feedbackItem={item} compact />
                    <Button variant="ghost" size="icon" title="View details">
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
