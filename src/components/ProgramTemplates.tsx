
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProgramTemplatesProps {
  onGenerate: () => void;
  loading: Record<string, boolean>;
}

const ProgramTemplates = ({ onGenerate, loading }: ProgramTemplatesProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
        className: "bg-hacker-card border-hacker-red text-white",
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setSelectedFile(null);
      
      toast({
        title: "Upload Complete",
        description: `${selectedFile.name} uploaded successfully.`,
        className: "bg-hacker-card border-hacker-green text-white",
      });
      
      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }, 2000);
  };

  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-hacker-green neonGreen mb-4 flex items-center gap-2">
        <span className="bg-hacker-darkgreen p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" /><path d="M12 3v6" /></svg>
        </span>
        Program Templates
      </h2>
      
      <div className="mb-4 text-sm text-hacker-green">
        Upload Program Templates to Cluster
      </div>
      
      <div className="flex gap-2 mb-4">
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer bg-hacker-card hover:bg-opacity-80 text-white px-4 py-2 rounded border border-hacker-border flex items-center"
        >
          Choose file
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <div className="flex-1 text-gray-400 flex items-center pl-2 border border-hacker-border bg-hacker-background rounded truncate">
          {selectedFile ? selectedFile.name : "No file chosen"}
        </div>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
      
      <Button 
        className="w-full bg-hacker-darkgreen hover:bg-hacker-green text-white flex items-center justify-center h-12"
        onClick={onGenerate}
        disabled={loading.generate}
      >
        {loading.generate ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Generate
          </>
        )}
      </Button>
    </div>
  );
};

export default ProgramTemplates;
