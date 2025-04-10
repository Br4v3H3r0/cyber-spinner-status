import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import MachineStatus from "./MachineStatus";
import ResourceUsage from "./ResourceUsage";
import ProgramTemplates from "./ProgramTemplates";
import ViewCrashes from "./ViewCrashes";
import TesterNode, { TesterStatus } from "./TesterNode";
import GenerateDialog from "./GenerateDialog";
import CrashFileDialog from "./CrashFileDialog";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isCrashFileOpen, setIsCrashFileOpen] = useState(false);
  const [selectedCrashFile, setSelectedCrashFile] = useState("");
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [testerStatus, setTesterStatus] = useState<TesterStatus>("idle");
  const [activeNodes, setActiveNodes] = useState<Record<string, boolean>>({});
  const [testerActive, setTesterActive] = useState(false);
  
  const handleStartFuzzer = (ip: string) => {
    if (activeNodes[ip]) return; // Skip if already active
    
    setLoading(prev => ({ ...prev, [`start-${ip}`]: true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [`start-${ip}`]: false }));
      setActiveNodes(prev => ({ ...prev, [ip]: true }));
      
      toast({
        title: "Fuzzer Started",
        description: `Fuzzer on ${ip} started successfully.`,
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 1500);
  };

  const handleStopFuzzer = (ip: string) => {
    if (!activeNodes[ip]) return; // Skip if already inactive
    
    setLoading(prev => ({ ...prev, [`stop-${ip}`]: true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [`stop-${ip}`]: false }));
      setActiveNodes(prev => ({ ...prev, [ip]: false }));
      
      toast({
        title: "Fuzzer Stopped",
        description: `Fuzzer on ${ip} stopped successfully.`,
        className: "bg-hacker-card border-hacker-red text-white",
      });
    }, 1500);
  };

  const handleStartTester = () => {
    if (testerActive) return; // Skip if already active
    
    setLoading(prev => ({ ...prev, "start-tester": true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, "start-tester": false }));
      setTesterActive(true);
      
      toast({
        title: "Tester Started",
        description: "Tester node started successfully.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 1500);
  };

  const handleStopTester = () => {
    if (!testerActive) return; // Skip if already inactive
    
    setLoading(prev => ({ ...prev, "stop-tester": true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, "stop-tester": false }));
      setTesterActive(false);
      
      toast({
        title: "Tester Stopped",
        description: "Tester node stopped successfully.",
        className: "bg-hacker-card border-hacker-red text-white",
      });
    }, 1500);
  };
  
  const handleResetTester = () => {
    setLoading(prev => ({ ...prev, "reset-tester": true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, "reset-tester": false }));
      setTesterStatus("idle");
      toast({
        title: "Tester Reset",
        description: "Tester node reset successfully.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 1000);
  };

  const handleViewCrashFile = (filename: string) => {
    setSelectedCrashFile(filename);
    setIsCrashFileOpen(true);
  };

  const handleGenerate = () => {
    setIsGenerateOpen(true);
  };
  
  const handleSendToTester = () => {
    setTesterStatus("testing");
    
    // Simulate testing process
    setTimeout(() => {
      // Randomly decide if test passes or fails
      const success = Math.random() > 0.3; // 70% chance of success
      
      setTesterStatus(success ? "success" : "error");
      
      toast({
        title: success ? "Test Successful" : "Test Failed",
        description: success 
          ? "The test completed successfully. You can now upload the template." 
          : "The test failed. Please check the template and try again.",
        className: `bg-hacker-card border-${success ? 'hacker-green' : 'hacker-red'} text-white`,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 text-white">
      <header className="flex items-center py-4">
        <div className="text-hacker-green text-3xl font-bold neonGreen tracking-wider">
          &gt;_ PHUZZILLI
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     
          <MachineStatus 
            onStart={handleStartFuzzer} 
            onStop={handleStopFuzzer} 
            loading={loading}
            activeNodes={activeNodes}
          />
        
        <div className="grid grid-rows-2 gap-6">
          <ResourceUsage />
          <ViewCrashes 
            onViewFile={handleViewCrashFile}
          />
        </div>
        {/* <div className="lg:col-span-6"> */}
          <ProgramTemplates 
            onGenerate={handleGenerate} 
            loading={loading}
            onSendToTester={handleSendToTester}
            testerStatus={testerStatus}
          />
        {/* </div> */}
        {/* <div className="lg:col-span-4"> */}
          <TesterNode 
            onStart={handleStartTester}
            onStop={handleStopTester}
            onReset={handleResetTester}
            loading={loading}
            testerStatus={testerStatus}
            isActive={testerActive}
          />
        {/* </div> */}
      </div>

      <GenerateDialog 
        open={isGenerateOpen} 
        onOpenChange={setIsGenerateOpen}
      />
      
      <CrashFileDialog 
        open={isCrashFileOpen} 
        onOpenChange={setIsCrashFileOpen}
        filename={selectedCrashFile}
      />
    </div>
  );
};

export default Dashboard;
