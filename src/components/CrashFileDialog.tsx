
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
recursiveFunction();`,
  
  "crash-3.js": `function typeConfusion() {
  let obj = { prop: "value" };
  obj.__proto__ = 42;  // Type confusion
  return obj.toString();
}
typeConfusion();`,
  
  "crash-4.js": `function bufferOverflow() {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.getBigInt64(16);  // Out of bounds
}
bufferOverflow();`,
  
  "crash-5.js": `function useAfterFree() {
  let ref = { value: "test" };
  let weakref = new WeakRef(ref);
  ref = null;
  // Force garbage collection in a real scenario
  // Try to use after free
  console.log(weakref.deref().value);
}
useAfterFree();`,
  
  "crash-6.js": `function integerOverflow() {
  const max = Number.MAX_SAFE_INTEGER;
  let result = max + 10;
  console.log(max, result);
  for (let i = 0; i < result; i++) {
    // This loop might never end due to integer overflow
  }
}
integerOverflow();`,
  
  "crash-7.js": `async function promiseChain() {
  let chain = Promise.resolve();
  for (let i = 0; i < 100000; i++) {
    chain = chain.then(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    });
  }
  await chain;
}
promiseChain();`,
  
  "crash-8.js": `function regexDenial() {
  const input = "a".repeat(100000);
  const pattern = /a+b$/;  // Catastrophic backtracking
  pattern.test(input);
}
regexDenial();`,
  
  "crash-9.js": `function domCrash() {
  if (typeof document !== 'undefined') {
    for (let i = 0; i < 100000; i++) {
      document.body.appendChild(document.createElement('div'));
    }
  }
}
domCrash();`,
  
  "crash-10.js": `function prototypePoison() {
  Object.prototype.hasOwnProperty = function() {
    throw new Error("Poisoned prototype!");
  };
  const obj = { a: 1 };
  console.log(obj.hasOwnProperty('a'));
}
prototypePoison();`,
  
  "crash-11.js": `function stackOverflow() {
  const obj = {};
  JSON.stringify(obj);
  Object.defineProperty(obj, 'prop', {
    get: function() { return this; }
  });
  try {
    JSON.stringify(obj); // Infinite recursion
  } catch (e) {
    console.log(e);
  }
}
stackOverflow();`,
  
  "crash-12.js": `function memoryLeak() {
  const leaks = [];
  function LeakyClass() {
    this.data = new Array(10000).fill('leak data');
  }
  for (let i = 0; i < 1000; i++) {
    leaks.push(new LeakyClass());
  }
  console.log('Created', leaks.length, 'leaks');
}
memoryLeak();`
};

const CrashFileDialog = ({ open, onOpenChange, filename }: CrashFileDialogProps) => {
  const { toast } = useToast();
  const content = crashFileContents[filename] || "";
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: `${filename} code has been copied to your clipboard.`,
      className: "bg-hacker-card border-hacker-green text-white",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-hacker-card border-hacker-border text-white sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-hacker-green font-mono">{filename}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCopyToClipboard}
              className="text-hacker-green hover:text-white hover:bg-hacker-darkgreen"
            >
              <Copy size={16} />
            </Button>
            <DialogClose className="text-gray-400 hover:text-white">
              <X size={18} />
            </DialogClose>
          </div>
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
