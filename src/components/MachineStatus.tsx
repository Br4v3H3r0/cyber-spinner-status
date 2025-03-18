
import { useState } from "react";
import { Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TotalHashrate from "./TotalHashrate";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MachineType = "main" | "variant";

type MachineData = {
  ip: string;
  status: "active" | "inactive";
  hashrate: number;
  type: MachineType;
  role: "master" | "slave";
};

const MACHINES: MachineData[] = [
  { ip: "192.168.1.101", status: "active", hashrate: 5120, type: "main", role: "master" },
  { ip: "192.168.1.102", status: "active", hashrate: 4870, type: "main", role: "slave" },
  { ip: "192.168.1.103", status: "inactive", hashrate: 0, type: "main", role: "slave" },
  { ip: "192.168.1.104", status: "active", hashrate: 4350, type: "variant", role: "master" },
  { ip: "192.168.1.105", status: "inactive", hashrate: 0, type: "variant", role: "slave" },
];

interface MachineStatusProps {
  onStart: (ip: string) => void;
  onStop: (ip: string) => void;
  loading: Record<string, boolean>;
}

const MachineStatus = ({ onStart, onStop, loading }: MachineStatusProps) => {
  const { toast } = useToast();
  const [machines, setMachines] = useState<MachineData[]>(MACHINES);
  const [newIpDialogOpen, setNewIpDialogOpen] = useState<Record<MachineType, boolean>>({
    main: false,
    variant: false
  });
  const [newIp, setNewIp] = useState<Record<MachineType, string>>({
    main: "",
    variant: ""
  });
  const [newRole, setNewRole] = useState<Record<MachineType, "master" | "slave">>({
    main: "slave",
    variant: "slave"
  });
  
  const mainMachines = machines.filter(m => m.type === "main");
  const variantMachines = machines.filter(m => m.type === "variant");
  
  const totalHashrateMain = mainMachines.reduce((sum, machine) => sum + machine.hashrate, 0);
  const totalHashrateVariant = variantMachines.reduce((sum, machine) => sum + machine.hashrate, 0);
  
  // Check if a master already exists for a specific machine type
  const hasMaster = (type: MachineType): boolean => {
    return machines.some(m => m.type === type && m.role === "master");
  };
  
  const handleAddIp = (type: MachineType) => {
    const ip = newIp[type];
    if (ip && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) {
      const newMachine: MachineData = {
        ip,
        status: "inactive",
        hashrate: 0,
        type,
        role: newRole[type]
      };
      
      setMachines([...machines, newMachine]);
      setNewIp({ ...newIp, [type]: "" });
      setNewRole({ ...newRole, [type]: "slave" }); // Reset role to slave after adding
      setNewIpDialogOpen({ ...newIpDialogOpen, [type]: false });
      
      toast({
        title: "Machine Added",
        description: `${ip} added to the ${type} network as ${newRole[type]}.`,
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

  const renderMachineTable = (type: MachineType, title: string) => {
    const filteredMachines = machines.filter(m => m.type === type);
    const hasMasterForType = hasMaster(type);
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-hacker-green">{title}</h3>
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
              {filteredMachines.map((machine) => (
                <tr key={machine.ip} className="border-b border-hacker-border">
                  <td className="py-3 font-mono flex items-center gap-2">
                    {machine.ip}
                    <Badge className={machine.role === "master" 
                      ? "bg-hacker-darkgreen text-white" 
                      : "bg-hacker-card text-gray-300 border border-gray-600"}
                    >
                      {machine.role === "master" ? "Master" : "Slave"}
                    </Badge>
                  </td>
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
                        disabled={loading[`stop-${machine.ip}`] || loading[`start-${machine.ip}`]}
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
                        disabled={loading[`start-${machine.ip}`] || loading[`stop-${machine.ip}`]}
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
                      disabled={machine.status === "active" || loading[`start-${machine.ip}`] || loading[`stop-${machine.ip}`]}
                      className={`text-hacker-red hover:text-white hover:bg-hacker-darkred ${
                        machine.status === "active" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-2">
          {newIpDialogOpen[type] ? (
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="text"
                value={newIp[type]}
                onChange={(e) => setNewIp({ ...newIp, [type]: e.target.value })}
                placeholder="Enter IP address"
                className="bg-hacker-background border border-hacker-border text-white px-3 py-2 rounded"
              />
              
              <Select
                value={newRole[type]}
                onValueChange={(value: "master" | "slave") => setNewRole({ ...newRole, [type]: value })}
              >
                <SelectTrigger className="w-[120px] bg-hacker-background border-hacker-border text-white">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-hacker-card border-hacker-border text-white">
                  <SelectItem 
                    value="master" 
                    disabled={hasMasterForType}
                    className={hasMasterForType ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Master
                  </SelectItem>
                  <SelectItem value="slave">Slave</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                size="sm"
                onClick={() => handleAddIp(type)}
                className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
              >
                Add
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNewIpDialogOpen({ ...newIpDialogOpen, [type]: false });
                  setNewRole({ ...newRole, [type]: "slave" }); // Reset role to slave when canceling
                }}
                className="text-hacker-red hover:bg-hacker-darkred"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setNewIpDialogOpen({ ...newIpDialogOpen, [type]: true })}
              className="bg-hacker-darkgreen hover:bg-hacker-green text-white"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {title} Machine
            </Button>
          )}
        </div>
      </div>
    );
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
        <TotalHashrate main={totalHashrateMain} variant={totalHashrateVariant} />
      </div>
      
      {renderMachineTable("main", "Fuzzilli Main")}
      {renderMachineTable("variant", "Fuzzilli Variant")}
    </div>
  );
};

export default MachineStatus;
