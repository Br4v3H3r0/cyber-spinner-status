
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SystemControlProps {
  loading: Record<string, boolean>;
}

const SystemControl = ({ loading }: SystemControlProps) => {
  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-hacker-green neonGreen mb-4 flex items-center gap-2">
        <span className="bg-hacker-darkgreen p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="m16.24 6.76 2.83-2.83" /><path d="M22 12h-4" /><path d="m17.24 17.24 2.83 2.83" /><path d="M12 18v4" /><path d="M6.76 17.24 3.93 20.07" /><path d="M2 12h4" /><path d="M6.76 6.76 3.93 3.93" /></svg>
        </span>
        System Control
      </h2>
      
      <div className="bg-hacker-background p-4 rounded border border-hacker-border">
        <h3 className="text-hacker-green mb-2">System Status</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-300">
          <div>
            <div className="mb-1">Active Machines (Main): <span className="text-white">2</span></div>
            <div>Running Fuzzers (Main): <span className="text-white">1</span></div>
          </div>
          <div>
            <div className="mb-1">Active Machines (Variant): <span className="text-white">1</span></div>
            <div>Running Fuzzers (Variant): <span className="text-white">0</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemControl;
