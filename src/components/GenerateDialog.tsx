
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GenerateDialog = ({ open, onOpenChange }: GenerateDialogProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  
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
      setPrompt("");
      onOpenChange(false);
      
      toast({
        title: "Template Generated",
        description: "Your test case template has been generated successfully.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-hacker-card border-hacker-border text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-hacker-green neonGreen">Generate Program Template</DialogTitle>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDialog;
