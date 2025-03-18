
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type TesterStatus = "idle" | "testing" | "error";

interface TesterNodeProps {
  onStart: () => void;
  onStop: () => void;
  loading: Record<string, boolean>;
}

const TesterNode = ({ onStart, onStop, loading }: TesterNodeProps) => {
  // Mock data for the tester node
  const testerData = {
    ip: "192.168.1.200",
    status: "active" as const,
    hashrate: 3500,
    testerStatus: "idle" as TesterStatus
  };

  const getStatusColor = (status: TesterStatus) => {
    switch(status) {
      case "idle": return "bg-hacker-green";
      case "testing": return "bg-yellow-500";
      case "error": return "bg-hacker-red";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: TesterStatus) => {
    switch(status) {
      case "idle": return "Idle";
      case "testing": return "Testing";
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
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Stopping
                      </>
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
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting
                      </>
                    ) : (
                      "Start"
                    )}
                  </Button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex items-center">
        <div className="text-white mr-2">Tester Status:</div>
        <Badge className={`${getStatusColor(testerData.testerStatus)} px-3 py-1`}>
          {getStatusText(testerData.testerStatus)}
        </Badge>
      </div>
    </div>
  );
};

export default TesterNode;
