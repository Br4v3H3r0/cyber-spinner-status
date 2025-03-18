
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Textarea } from "@/components/ui/textarea";

interface TemplateFile {
  name: string;
  content: string;
}

interface GenerateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateFile | null;
  onSave?: (updatedContent: string) => void;
}

const GenerateTemplateDialog = ({ 
  open, 
  onOpenChange, 
  template,
  onSave
}: GenerateTemplateDialogProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState("");

  useEffect(() => {
    if (template) {
      setEditableContent(template.content);
    }
  }, [template]);

  const handleCopyToClipboard = () => {
    if (template) {
      navigator.clipboard.writeText(editMode ? editableContent : template.content);
      toast({
        title: "Copied to clipboard",
        description: "Template code has been copied to your clipboard.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = () => {
    if (onSave) {
      onSave(editableContent);
    }
    
    toast({
      title: "Changes Saved",
      description: "Your changes to the template have been saved.",
      className: "bg-hacker-card border-hacker-green text-white",
    });
    
    setEditMode(false);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-hacker-card border-hacker-border text-white sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-hacker-green neonGreen">{template.name}</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 bg-hacker-background rounded border border-hacker-border mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-hacker-green">Template Code</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleToggleEditMode}
                className="text-hacker-green hover:text-white hover:bg-hacker-darkgreen"
              >
                {editMode ? "View Mode" : "Edit Mode"}
              </Button>
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
          </div>
          
          {editMode ? (
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm bg-[#121419] border-hacker-border text-white p-4"
            />
          ) : (
            <SyntaxHighlighter
              language="javascript"
              style={atomDark}
              customStyle={{
                backgroundColor: '#121419',
                padding: '16px',
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '500px',
                maxHeight: '500px',
                overflowY: 'auto'
              }}
            >
              {editMode ? editableContent : template.content}
            </SyntaxHighlighter>
          )}
        </div>
        
        <div className="flex justify-between">
          {editMode && (
            <Button
              className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
              onClick={handleSaveChanges}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          )}
          
          <Button
            className="bg-hacker-darkgreen hover:bg-hacker-green text-white ml-auto"
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
