
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Trash, Maximize2, Edit, Save, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";

export type TesterStatus = "idle" | "testing" | "success" | "error";

interface TesterNodeProps {
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  loading: Record<string, boolean>;
  testerStatus: TesterStatus;
  isActive: boolean;
}

const TesterNode = ({ onStart, onStop, onReset, loading, testerStatus, isActive }: TesterNodeProps) => {
  const { toast } = useToast();
  const [isErrorLogOpen, setIsErrorLogOpen] = useState(false);
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [ip, setIp] = useState("192.168.1.200");
  const [tempIp, setTempIp] = useState(ip);
  
  const testerData = {
    status: isActive ? "active" as const : "inactive" as const,
    hashrate: isActive ? 3500 : 0,
  };

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
  
  const handleEditIp = () => {
    setIsEditingIp(true);
    setTempIp(ip);
  };
  
  const handleSaveIp = () => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(tempIp)) {
      toast({
        title: "Invalid IP Address",
        description: "Please enter a valid IPv4 address (e.g., 192.168.1.1)",
        variant: "destructive",
        className: "bg-hacker-card border-hacker-red text-white",
      });
      return;
    }
    
    setIp(tempIp);
    setIsEditingIp(false);
    
    toast({
      title: "IP Address Updated",
      description: `Tester node IP changed to ${tempIp}`,
      className: "bg-hacker-card border-hacker-green text-white",
    });
  };
  
  const handleCancelEdit = () => {
    setIsEditingIp(false);
    setTempIp(ip);
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
              <td className="py-3 font-mono">
                {isEditingIp ? (
                  <div className="flex items-center gap-1">
                    <Input 
                      value={tempIp}
                      onChange={(e) => setTempIp(e.target.value)}
                      className="h-8 text-xs py-1 font-mono bg-hacker-background border-hacker-border text-white"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveIp}
                      className="text-hacker-green hover:text-white hover:bg-hacker-darkgreen h-7 w-7 p-0"
                    >
                      <Save size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className="text-hacker-red hover:text-white hover:bg-hacker-darkred h-7 w-7 p-0"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>{ip}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditIp}
                      className="text-hacker-green hover:text-white hover:bg-hacker-darkgreen ml-2 h-7 w-7 p-0"
                      disabled={testerData.status === "active" || loading["start-tester"] || loading["stop-tester"]}
                    >
                      <Edit size={14} />
                    </Button>
                  </div>
                )}
              </td>
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
          <div className="mt-4 flex items-center">
            <span className="text-hacker-red font-semibold mr-2">Error Trace:</span>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-hacker-red border-hacker-red hover:bg-hacker-darkred hover:text-white"
              onClick={() => setIsErrorLogOpen(true)}
            >
              <Maximize2 size={14} className="mr-1" />
              View Details
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isErrorLogOpen} onOpenChange={setIsErrorLogOpen}>
        <DialogContent className="bg-hacker-card border-hacker-border text-white max-w-4xl max-h-[90vh] w-[90vw] flex flex-col">
          <DialogTitle className="text-hacker-red">Error Trace Log</DialogTitle>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-[70vh] rounded border border-hacker-border bg-hacker-background">
              <div className="p-4">
                <div className="overflow-x-auto w-full">
                  <pre className="font-mono text-sm w-max min-w-full">
                    <SyntaxHighlighter 
                      language="javascript" 
                      style={tomorrow} 
                      customStyle={{
                        backgroundColor: 'transparent',
                        padding: '16px',
                        margin: 0,
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        minWidth: '100%'
                      }}
                      wrapLongLines={false}
                    >
                      {errorLog}
                    </SyntaxHighlighter>
                  </pre>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TesterNode;
