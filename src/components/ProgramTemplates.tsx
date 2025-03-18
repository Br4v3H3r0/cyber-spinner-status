
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, MessageSquare, Trash, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GenerateTemplateDialog from "./GenerateTemplateDialog";

interface TemplateFile {
  name: string;
  content: string;
}

interface ProgramTemplatesProps {
  onGenerate: () => void;
  loading: Record<string, boolean>;
}

const ProgramTemplates = ({ onGenerate, loading }: ProgramTemplatesProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<TemplateFile | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

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

  const handleGenerate = () => {
    onGenerate();
    
    // Simulate receiving a generated template after dialog is closed
    setTimeout(() => {
      setGeneratedTemplate({
        name: "generatedTest.js",
        content: `function generateTestCase() {
  // Create array with random values
  const array = new Array(10).fill(0).map(() => Math.floor(Math.random() * 100));
  
  // Sort the array
  array.sort((a, b) => a - b);
  
  // Try to access an out-of-bounds index
  const boundaryTest = array[array.length];
  console.log(boundaryTest); // Should be undefined
  
  // Create a large array that might cause memory issues
  const largeArray = new Array(1000000);
  
  // Fill with objects to increase memory pressure
  for (let i = 0; i < 1000; i++) {
    largeArray[i] = { 
      index: i,
      data: new Array(1000).fill(i)
    };
  }
  
  // Recursive function with poor termination condition
  function recursiveTest(depth) {
    if (depth > 100) return;
    return recursiveTest(depth + 1);
  }
  
  try {
    recursiveTest(0);
  } catch (e) {
    console.error("Recursion failed:", e);
  }
  
  return array;
}

// Run the test case
generateTestCase();`
      });
    }, 4000);
  };

  const handleSendToTester = () => {
    if (generatedTemplate) {
      toast({
        title: "Template Sent",
        description: `${generatedTemplate.name} has been sent to the tester node.`,
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }
  };

  const handleDeleteTemplate = () => {
    setGeneratedTemplate(null);
    toast({
      title: "Template Deleted",
      description: "Generated template has been deleted.",
      className: "bg-hacker-card border-hacker-red text-white",
    });
  };

  const handleViewTemplate = () => {
    if (generatedTemplate) {
      setTemplateDialogOpen(true);
    }
  };

  return (
    <div className="card-container h-[240px] flex flex-col">
      <h2 className="text-xl font-semibold text-hacker-green neonGreen mb-4 flex items-center gap-2">
        <span className="bg-hacker-darkgreen p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" /><path d="M12 3v6" /></svg>
        </span>
        Program Templates
      </h2>
      
      <div className="text-sm text-hacker-green mb-2">
        Upload Program Templates to Cluster
      </div>
      
      <div className="flex gap-2 mb-3">
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
      
      {generatedTemplate && (
        <div className="mb-3 bg-hacker-background border border-hacker-border rounded">
          <div className="flex items-center justify-between p-2 border-b border-hacker-border">
            <div 
              className="flex items-center gap-2 text-hacker-green cursor-pointer flex-1 truncate"
              onClick={handleViewTemplate}
            >
              <Code size={16} />
              <span className="truncate">{generatedTemplate.name}</span>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendToTester}
                className="text-hacker-green hover:bg-hacker-darkgreen hover:text-white"
              >
                Send to Tester
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteTemplate}
                className="text-hacker-red hover:bg-hacker-darkred hover:text-white"
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1"></div>
      
      <Button 
        className="w-full bg-hacker-darkgreen hover:bg-hacker-green text-white flex items-center justify-center h-10"
        onClick={handleGenerate}
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

      <GenerateTemplateDialog 
        open={templateDialogOpen} 
        onOpenChange={setTemplateDialogOpen}
        template={generatedTemplate}
      />
    </div>
  );
};

export default ProgramTemplates;
