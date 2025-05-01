
import React from "react";
import { Upload } from "lucide-react";
import { FormLabel } from "@/components/ui/form";

interface FileUploadProps {
  multiple?: boolean;
  onChange?: (files: FileList | null) => void;
}

const FileUpload = ({ multiple = true, onChange }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.files);
    }
  };

  return (
    <div>
      <FormLabel>Upload Photos (Optional)</FormLabel>
      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
        <div className="mt-4 flex justify-center text-sm">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple={multiple}
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1 text-muted-foreground">or drag and drop</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
