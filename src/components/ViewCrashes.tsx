import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Send, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

interface ViewCrashesProps {
  onViewFile: (filename: string) => void;
}

const initialCrashFiles = [
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
  const [crashFiles, setCrashFiles] = useState<string[]>(initialCrashFiles);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Crash statistics - for demo purposes we'll set 8 as flaky and the rest as deterministic
  const totalCrashes = crashFiles.length;
  const flakyCrashes = 8;
  const deterministic = totalCrashes - flakyCrashes;

  const handleToggleSelection = (filename: string) => {
    if (selectedFiles.includes(filename)) {
      setSelectedFiles(selectedFiles.filter(file => file !== filename));
    } else {
      setSelectedFiles([...selectedFiles, filename]);
    }
  };

  const handleDeleteCrash = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering row click
    setCrashFiles(crashFiles.filter(file => file !== filename));
    setSelectedFiles(selectedFiles.filter(file => file !== filename));
    
    toast({
      title: "Crash File Deleted",
      description: `${filename} has been deleted.`,
      className: "bg-hacker-card border-hacker-red text-white",
    });
  };

  const handleSendToVariant = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select crash files to send.",
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
        title: "Crashes Sent",
        description: `${selectedFiles.length} file(s) sent to Variant successfully.`,
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 1500);
  };

  return (
    <div className="card-container h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-hacker-green neonGreen flex items-center gap-2">
          <span className="bg-hacker-darkgreen p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13V7" /><path d="M12 17h.01" /><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
          </span>
          View Crashes
        </h2>
        
        <Card className="bg-hacker-card border border-hacker-border p-2">
          <div className="text-xs text-hacker-green font-semibold">Total Crashes</div>
          <div className="text-xl font-bold font-mono">{totalCrashes}</div>
          <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
            <div className="text-hacker-green">
              Flaky: <span className="font-mono">{flakyCrashes}</span>
            </div>
            <div className="text-hacker-red">
              Deterministic: <span className="font-mono">{deterministic}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="bg-hacker-background rounded border border-hacker-border flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 h-[120px]">
          <ul className="p-2">
            {crashFiles.map((file) => (
              <li 
                key={file}
                className="py-1 px-2 flex justify-between items-center cursor-pointer transition-colors rounded hover:bg-hacker-card"
              >
                <span 
                  className="flex-1 text-hacker-green truncate"
                  onClick={() => onViewFile(file)}
                >
                  {file}
                </span>
                <div className="flex items-center">
                  <div 
                    className={`w-6 h-6 rounded-full border flex items-center justify-center mr-2 transition-colors ${
                      selectedFiles.includes(file) 
                        ? 'bg-hacker-darkgreen border-hacker-green' 
                        : 'border-hacker-border'
                    }`}
                    onClick={() => handleToggleSelection(file)}
                  >
                    {selectedFiles.includes(file) && <Check size={14} className="text-white" />}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDeleteCrash(file, e)}
                    className="text-hacker-red hover:text-white hover:bg-hacker-darkred"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        
        <div className="p-3 border-t border-hacker-border mt-auto">
          <Button
            className="w-full bg-hacker-darkblue hover:bg-hacker-blue text-white"
            onClick={handleSendToVariant}
            disabled={selectedFiles.length === 0 || loading}
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
                Send Crashes to Variant
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewCrashes;
