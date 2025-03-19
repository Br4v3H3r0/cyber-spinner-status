
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Trash, Maximize2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";

export type TesterStatus = "idle" | "testing" | "success" | "error";

interface TesterNodeProps {
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  loading: Record<string, boolean>;
  testerStatus: TesterStatus;
}

const TesterNode = ({ onStart, onStop, onReset, loading, testerStatus }: TesterNodeProps) => {
  const { toast } = useToast();
  const [isErrorLogOpen, setIsErrorLogOpen] = useState(false);
  
  // Mock data for the tester node
  const testerData = {
    ip: "192.168.1.200",
    status: "active" as const,
    hashrate: 3500,
  };
  
  // Mock error log for the tester node
  const errorLog = `TypeError: Cannot read property 'length' of undefined
    at Object.execute (/home/fuzzer/variant/exploit.js:42:19)
    at FuzzGen.runTest (/home/fuzzer/variant/fuzzgen.js:156:22)
    at TesterNode.executeTest (/home/fuzzer/variant/tester.js:89:18)
    at process._tickCallback (internal/process/next_tick.js:68:7)

Stack trace:
  #0 0x12345 in v8::internal::Execution::Call(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*) /v8/src/execution.cc:169:13
  #1 0x23456 in v8::Function::Call(v8::Local<v8::Context>, v8::Local<v8::Value>, int, v8::Local<v8::Value>*) /v8/src/api.cc:5046:16
  #2 0x34567 in node::Environment::AsyncHooks::AsyncCall() /node/src/env-inl.h:375:22
  #3 0x45678 in node::AsyncWrap::MakeCallback() /node/src/async_wrap.cc:294:11
`;

  const handleDelete = () => {
    if (testerData.status !== "active") {
      toast({
        title: "Tester Node Deleted",
        description: "Tester node has been removed from the network.",
        className: "bg-hacker-card border-hacker-red text-white",
      });
    }
  };

  const getStatusColor = (status: TesterStatus) => {
    switch(status) {
      case "idle": return "bg-hacker-green";
      case "testing": return "bg-yellow-500";
      case "success": return "bg-hacker-green";
      case "error": return "bg-hacker-red";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: TesterStatus) => {
    switch(status) {
      case "idle": return "Idle";
      case "testing": return "Testing";
      case "success": return "Success";
      case "error": return "Error";
      default: return "Unknown";
    }
  };

  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-hacker-green neonGreen mb-4 flex items-center gap-2">
        <span className="bg-hacker-darkgreen p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 5-7 7 7 7" /></svg>
        </span>
        Tester Node
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hacker-border">
              <th className="text-left py-2 text-hacker-green">IP Address</th>
              <th className="text-center py-2 text-hacker-green">Status</th>
              <th className="text-left py-2 text-hacker-green">Hashrate</th>
              <th className="text-center py-2 text-hacker-green min-w-[120px]">Fuzzer</th>
              <th className="text-center py-2 text-hacker-green">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-hacker-border">
              <td className="py-3 font-mono">{testerData.ip}</td>
              <td className="py-3 text-center">
                <span className={`status-dot ${testerData.status === "active" ? "status-active" : "status-inactive"}`} />
              </td>
              <td className="py-3 font-mono">
                {testerData.status === "active" ? `${testerData.hashrate.toLocaleString()}` : "0"}
              </td>
              <td className="py-3 text-center">
                {testerData.status === "active" ? (
                  <Button
                    className="bg-hacker-darkred hover:bg-hacker-red text-white w-[100px]"
                    size="sm"
                    onClick={onStop}
                    disabled={loading["stop-tester"]}
                  >
                    {loading["stop-tester"] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Stop"
                    )}
                  </Button>
                ) : (
                  <Button
                    className="bg-hacker-darkgreen hover:bg-hacker-green text-white w-[100px]"
                    size="sm"
                    onClick={onStart}
                    disabled={loading["start-tester"]}
                  >
                    {loading["start-tester"] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Start"
                    )}
                  </Button>
                )}
              </td>
              <td className="py-3 text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={testerData.status === "active" || loading["start-tester"] || loading["stop-tester"]}
                  className={`text-hacker-red hover:text-white hover:bg-hacker-darkred ${
                    testerData.status === "active" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Trash size={16} />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-white mr-2">Tester Status:</div>
            <Badge className={`${getStatusColor(testerStatus)} px-3 py-1`}>
              {getStatusText(testerStatus)}
            </Badge>
          </div>
          
          <Button
            size="sm"
            onClick={onReset}
            className="bg-hacker-background hover:bg-hacker-card border border-hacker-border text-hacker-green"
            disabled={testerStatus === "idle" || loading["reset-tester"]}
          >
            {loading["reset-tester"] ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RotateCcw size={14} className="mr-1" />
                Reset
              </>
            )}
          </Button>
        </div>
        
        {testerStatus === "error" && (
          <div className="mt-4 border border-hacker-red rounded bg-hacker-background p-2">
            <div className="flex justify-between items-center mb-2">
              <div className="text-hacker-red font-semibold">Error Trace:</div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-hacker-red hover:bg-hacker-darkred hover:text-white"
                onClick={() => setIsErrorLogOpen(true)}
              >
                <Maximize2 size={14} />
              </Button>
            </div>
            <ScrollArea className="h-[80px]">
              <div className="font-mono text-xs text-white whitespace-pre">
                <SyntaxHighlighter 
                  language="javascript" 
                  style={tomorrow}
                  customStyle={{
                    backgroundColor: 'transparent',
                    padding: '8px',
                    margin: 0,
                    borderRadius: '4px'
                  }}
                >
                  {errorLog}
                </SyntaxHighlighter>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      
      <Dialog open={isErrorLogOpen} onOpenChange={setIsErrorLogOpen}>
        <DialogContent className="bg-hacker-card border-hacker-border text-white max-w-3xl">
          <DialogTitle className="text-hacker-red">Error Trace Log</DialogTitle>
          <ScrollArea className="h-[400px] mt-4">
            <SyntaxHighlighter 
              language="javascript" 
              style={tomorrow} 
              customStyle={{
                backgroundColor: 'transparent',
                padding: '16px',
                margin: 0,
                borderRadius: '4px'
              }}
            >
              {errorLog}
            </SyntaxHighlighter>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TesterNode;
