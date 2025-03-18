
import { useState } from "react";
import { Loader2 } from "lucide-react";
import MachineStatus from "./MachineStatus";
import ResourceUsage from "./ResourceUsage";
import ProgramTemplates from "./ProgramTemplates";
import ViewCrashes from "./ViewCrashes";
import SystemControl from "./SystemControl";
import TesterNode from "./TesterNode";
import GenerateDialog from "./GenerateDialog";
import CrashFileDialog from "./CrashFileDialog";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isCrashFileOpen, setIsCrashFileOpen] = useState(false);
  const [selectedCrashFile, setSelectedCrashFile] = useState("");
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  const handleStartFuzzer = (ip: string) => {
    setLoading(prev => ({ ...prev, [`start-${ip}`]: true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [`start-${ip}`]: false }));
      toast({
        title: "Fuzzer Started",
        description: `Fuzzer on ${ip} started successfully.`,
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 1500);
  };

  const handleStopFuzzer = (ip: string) => {
    setLoading(prev => ({ ...prev, [`stop-${ip}`]: true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [`stop-${ip}`]: false }));
      toast({
        title: "Fuzzer Stopped",
        description: `Fuzzer on ${ip} stopped successfully.`,
        className: "bg-hacker-card border-hacker-red text-white",
      });
    }, 1500);
  };

  const handleStartTester = () => {
    setLoading(prev => ({ ...prev, "start-tester": true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, "start-tester": false }));
      toast({
        title: "Tester Started",
        description: "Tester node started successfully.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 1500);
  };

  const handleStopTester = () => {
    setLoading(prev => ({ ...prev, "stop-tester": true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, "stop-tester": false }));
      toast({
        title: "Tester Stopped",
        description: "Tester node stopped successfully.",
        className: "bg-hacker-card border-hacker-red text-white",
      });
    }, 1500);
  };

  const handleViewCrashFile = (filename: string) => {
    setSelectedCrashFile(filename);
    setIsCrashFileOpen(true);
  };

  const handleGenerate = () => {
    setIsGenerateOpen(true);
  };

  const handleStartAllFuzzers = () => {
    setLoading(prev => ({ ...prev, "start-all": true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, "start-all": false }));
      toast({
        title: "All Fuzzers Started",
        description: "All fuzzers started successfully.",
        className: "bg-hacker-card border-hacker-green text-white",
      });
    }, 2000);
  };

  const handleStopAllFuzzers = () => {
    setLoading(prev => ({ ...prev, "stop-all": true }));
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, "stop-all": false }));
      toast({
        title: "All Fuzzers Stopped",
        description: "All fuzzers stopped successfully.",
        className: "bg-hacker-card border-hacker-red text-white",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 text-white">
      <header className="flex items-center py-4">
        <div className="text-hacker-green text-3xl font-bold neonGreen tracking-wider">
          &gt;_ PHUZZILLI
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MachineStatus 
          onStart={handleStartFuzzer} 
          onStop={handleStopFuzzer} 
          loading={loading}
        />
        <div className="grid grid-rows-2 gap-6">
          <ResourceUsage />
          <TesterNode 
            onStart={handleStartTester}
            onStop={handleStopTester}
            loading={loading}
          />
        </div>
        <ProgramTemplates 
          onGenerate={handleGenerate} 
          loading={loading}
        />
        <ViewCrashes 
          onViewFile={handleViewCrashFile}
        />
        <div className="md:col-span-2">
          <SystemControl 
            onStartAll={handleStartAllFuzzers} 
            onStopAll={handleStopAllFuzzers}
            loading={loading}
          />
        </div>
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
