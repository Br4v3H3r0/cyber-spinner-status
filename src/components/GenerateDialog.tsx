
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface GenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GenerateDialog = ({ open, onOpenChange }: GenerateDialogProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  
  const sampleTemplateCode = `function generateTestCase() {
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
generateTestCase();`;
  
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your test case.",
        variant: "destructive",
        className: "bg-hacker-card border-hacker-red text-white",
      });
      return;
    }
    
    setGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      setGenerating(false);
      setGeneratedContent(sampleTemplateCode);
      
      toast({
        title: "Template Generated",
        description: "Your test case template has been generated successfully.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 2000);
  };
  
  const handleCopyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied to clipboard",
        description: "Template code has been copied to your clipboard.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }
  };
  
  const handleReset = () => {
    setGeneratedContent(null);
    setPrompt("");
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleReset();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="bg-hacker-card border-hacker-border text-white sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-hacker-green neonGreen">Generate Program Template</DialogTitle>
        </DialogHeader>
        
        {!generatedContent ? (
          <>
            <div className="py-4">
              <Textarea
                className="min-h-32 bg-hacker-background border-hacker-border text-white font-mono placeholder:text-gray-500"
                placeholder="Describe your test case requirements..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Template
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-hacker-background rounded border border-hacker-border mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-hacker-green">Generated Template</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopyToClipboard}
                  className="text-hacker-green hover:text-white hover:bg-hacker-darkgreen"
                >
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
              </div>
              <SyntaxHighlighter
                language="javascript"
                style={atomDark}
                customStyle={{
                  backgroundColor: '#121419',
                  padding: '16px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}
              >
                {generatedContent}
              </SyntaxHighlighter>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="border-hacker-border hover:bg-hacker-darkgreen text-hacker-green hover:text-white"
                onClick={handleReset}
              >
                Generate Another
              </Button>
              
              <Button
                className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDialog;
