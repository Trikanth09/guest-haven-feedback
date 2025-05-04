
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshBarProps {
  lastRefreshTime: Date;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

const RefreshBar = ({ 
  lastRefreshTime, 
  isRefreshing, 
  onRefresh 
}: RefreshBarProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-muted-foreground">
        Last updated: {lastRefreshTime.toLocaleTimeString()}
        <span className="text-xs ml-2">(Updates automatically and every 10s)</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>{isRefreshing ? 'Refreshing...' : 'Refresh Now'}</span>
      </Button>
    </div>
  );
};

export default RefreshBar;
