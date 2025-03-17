
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CrashFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filename: string;
}

const crashFileContents: Record<string, string> = {
  "crash-1.js": `function testCrash() {
  let arr = [];
  for (let i = 0; i < 1000000; i++) {
    arr.push(new Array(1000000));
  }
}
testCrash();`,
  "crash-2.js": `function recursiveFunction() {
  recursiveFunction();
}
recursiveFunction();`
};

const CrashFileDialog = ({ open, onOpenChange, filename }: CrashFileDialogProps) => {
  const content = crashFileContents[filename] || "";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-hacker-card border-hacker-border text-white sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-hacker-green font-mono">{filename}</DialogTitle>
          <DialogClose className="text-gray-400 hover:text-white">
            <X size={18} />
          </DialogClose>
        </DialogHeader>
        
        <div className="py-2 font-mono">
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            customStyle={{
              backgroundColor: '#1a1c25',
              padding: '20px',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrashFileDialog;
