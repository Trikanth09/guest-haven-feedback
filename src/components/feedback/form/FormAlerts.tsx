
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

type ExcelSyncStatus = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

type FormAlertsProps = {
  excelSyncStatus: ExcelSyncStatus;
};

const FormAlerts = ({ excelSyncStatus }: FormAlertsProps) => {
  if (excelSyncStatus.status === 'idle') return null;
  
  if (excelSyncStatus.status === 'success') {
    return (
      <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle>Excel Sync Success</AlertTitle>
        <AlertDescription>{excelSyncStatus.message}</AlertDescription>
      </Alert>
    );
  }
  
  if (excelSyncStatus.status === 'error') {
    return (
      <Alert className="mb-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle>Excel Sync Warning</AlertTitle>
        <AlertDescription>{excelSyncStatus.message}</AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default FormAlerts;
