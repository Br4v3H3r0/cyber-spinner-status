
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface ViewCrashesProps {
  onViewFile: (filename: string) => void;
}

const crashFiles = [
  "crash-1.js",
  "crash-2.js",
  "crash-3.js",
  "crash-4.js",
  "crash-5.js",
  "crash-6.js",
  "crash-7.js",
  "crash-8.js",
  "crash-9.js",
  "crash-10.js",
  "crash-11.js",
  "crash-12.js"
];

const ViewCrashes = ({ onViewFile }: ViewCrashesProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendToVariant = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a crash file to send.",
        variant: "destructive",
        className: "bg-hacker-card border-hacker-red text-white",
      });
      return;
    }

    setLoading(true);
    
    // Simulate sending
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Crash Sent",
        description: `${selectedFile} sent to Variant successfully.`,
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 1500);
  };

  return (
    <div className="card-container h-[400px] flex flex-col">
      <h2 className="text-xl font-semibold text-hacker-green neonGreen mb-4 flex items-center gap-2">
        <span className="bg-hacker-darkgreen p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13V7" /><path d="M12 17h.01" /><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
        </span>
        View Crashes
      </h2>
      
      <div className="bg-hacker-background rounded border border-hacker-border flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <ul className="p-4">
            {crashFiles.map((file) => (
              <li 
                key={file}
                className={`py-2 px-2 flex justify-between items-center cursor-pointer transition-colors rounded ${selectedFile === file ? 'bg-hacker-darkgreen bg-opacity-30' : 'hover:bg-hacker-card'}`}
              >
                <span 
                  className={`flex-1 ${selectedFile === file ? 'text-white' : 'text-hacker-green'}`}
                  onClick={() => {
                    setSelectedFile(file);
                    onViewFile(file);
                  }}
                >
                  {file}
                </span>
                <Button
                  size="sm"
                  variant="ghost" 
                  className="ml-2 hover:bg-hacker-darkgreen hover:text-white"
                  onClick={() => setSelectedFile(file)}
                >
                  Select
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
        
        <div className="p-4 border-t border-hacker-border">
          <Button
            className="w-full bg-hacker-darkblue hover:bg-hacker-blue text-white"
            onClick={handleSendToVariant}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Crash to Variant
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewCrashes;
