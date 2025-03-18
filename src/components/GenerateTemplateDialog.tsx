
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TemplateFile {
  name: string;
  content: string;
}

interface GenerateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateFile | null;
}

const GenerateTemplateDialog = ({ open, onOpenChange, template }: GenerateTemplateDialogProps) => {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (template) {
      navigator.clipboard.writeText(template.content);
      toast({
        title: "Copied to clipboard",
        description: "Template code has been copied to your clipboard.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-hacker-card border-hacker-border text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-hacker-green neonGreen">{template.name}</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 bg-hacker-background rounded border border-hacker-border mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-hacker-green">Template Code</h3>
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
              maxHeight: '500px',
              overflowY: 'auto'
            }}
          >
            {template.content}
          </SyntaxHighlighter>
        </div>
        
        <div className="flex justify-end">
          <Button
            className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateTemplateDialog;
