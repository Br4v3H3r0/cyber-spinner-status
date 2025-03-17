
import { useState } from "react";
import { Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import TotalHashrate from "./TotalHashrate";
import { useToast } from "@/components/ui/use-toast";

type MachineData = {
  ip: string;
  status: "active" | "inactive";
  hashrate: number;
};

const MACHINES: MachineData[] = [
  { ip: "192.168.1.101", status: "active", hashrate: 5120 },
  { ip: "192.168.1.102", status: "active", hashrate: 4870 },
  { ip: "192.168.1.103", status: "inactive", hashrate: 0 },
];

interface MachineStatusProps {
  onStart: (ip: string) => void;
  onStop: (ip: string) => void;
  loading: Record<string, boolean>;
}

const MachineStatus = ({ onStart, onStop, loading }: MachineStatusProps) => {
  const { toast } = useToast();
  const [machines, setMachines] = useState<MachineData[]>(MACHINES);
  const [newIpDialogOpen, setNewIpDialogOpen] = useState(false);
  const [newIp, setNewIp] = useState("");
  
  const totalHashrate = machines.reduce((sum, machine) => sum + machine.hashrate, 0);
  
  const handleAddIp = () => {
    if (newIp && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(newIp)) {
      const newMachine: MachineData = {
        ip: newIp,
        status: "inactive",
        hashrate: 0
      };
      
      setMachines([...machines, newMachine]);
      setNewIp("");
      setNewIpDialogOpen(false);
      
      toast({
        title: "Machine Added",
        description: `${newIp} added to the network.`,
        className: "bg-hacker-card border-hacker-green text-white",
      });
    } else {
      toast({
        title: "Invalid IP",
        description: "Please enter a valid IP address.",
        variant: "destructive",
        className: "bg-hacker-card border-hacker-red text-white",
      });
    }
  };
  
  const handleDelete = (ip: string) => {
    setMachines(machines.filter(m => m.ip !== ip));
    
    toast({
      title: "Machine Removed",
      description: `${ip} removed from the network.`,
      className: "bg-hacker-card border-hacker-red text-white",
    });
  };
  
  return (
    <div className="card-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-hacker-green neonGreen flex items-center gap-2">
          <span className="bg-hacker-darkgreen p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg>
          </span>
          Machine Status
        </h2>
        <TotalHashrate value={totalHashrate} />
      </div>
      
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
            {machines.map((machine) => (
              <tr key={machine.ip} className="border-b border-hacker-border">
                <td className="py-3 font-mono">{machine.ip}</td>
                <td className="py-3 text-center">
                  <span className={`status-dot ${machine.status === "active" ? "status-active" : "status-inactive"}`} />
                </td>
                <td className="py-3 font-mono">
                  {machine.status === "active" ? `${machine.hashrate.toLocaleString()}` : "0"}
                </td>
                <td className="py-3 text-center">
                  {machine.status === "active" ? (
                    <Button
                      className="bg-hacker-darkred hover:bg-hacker-red text-white w-[100px]"
                      size="sm"
                      onClick={() => onStop(machine.ip)}
                      disabled={loading[`stop-${machine.ip}`]}
                    >
                      {loading[`stop-${machine.ip}`] ? (
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
                      onClick={() => onStart(machine.ip)}
                      disabled={loading[`start-${machine.ip}`]}
                    >
                      {loading[`start-${machine.ip}`] ? (
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
                <td className="py-3 text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(machine.ip)}
                    className="text-hacker-red hover:text-white hover:bg-hacker-darkred"
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-end">
        {newIpDialogOpen ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="Enter IP address"
              className="bg-hacker-background border border-hacker-border text-white px-3 py-2 rounded"
            />
            <Button 
              size="sm"
              onClick={handleAddIp}
              className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
            >
              Add
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              onClick={() => setNewIpDialogOpen(false)}
              className="text-hacker-red hover:bg-hacker-darkred"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setNewIpDialogOpen(true)}
            className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Machine
          </Button>
        )}
      </div>
    </div>
  );
};

export default MachineStatus;
