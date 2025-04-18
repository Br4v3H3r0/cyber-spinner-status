import { useState } from "react";
import { Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TotalHashrate from "./TotalHashrate";
import ExecutionMetrics from "./ExecutionMetrics";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  activeNodes: Record<string, boolean>;
}

const MachineStatus = ({ onStart, onStop, loading, activeNodes }: MachineStatusProps) => {
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
  
  const updatedMachines = machines.map(machine => ({
    ...machine,
    status: activeNodes[machine.ip] ? "active" : "inactive",
    hashrate: activeNodes[machine.ip] ? machine.hashrate : 0,
  }));
  
  const mainMachines = updatedMachines.filter(m => m.type === "main");
  const variantMachines = updatedMachines.filter(m => m.type === "variant");
  
  const totalHashrateMain = mainMachines.reduce((sum, machine) => sum + machine.hashrate, 0);
  const totalHashrateVariant = variantMachines.reduce((sum, machine) => sum + machine.hashrate, 0);
  
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
      setNewRole({ ...newRole, [type]: "slave" });
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

  const totalExecs = {
    main: 1_234_567_890,
    variant: 876_543_210,
  };

  const coverage = {
    main: 67.8,
    variant: 54.3,
  };

  const renderMachineTable = (type: MachineType, title: string) => {
    const filteredMachines = updatedMachines.filter(m => m.type === type);
    const hasMasterForType = hasMaster(type);
    const tableHeight = type === "main" ? "h-[180px]" : "h-[120px]";
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-hacker-green">{title}</h3>
        </div>
        
        <div className="border border-hacker-border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-hacker-card sticky top-0 z-10">
              <TableRow className="border-b border-hacker-border">
                <TableHead className="text-left py-2 text-hacker-green">IP Address</TableHead>
                <TableHead className="text-right py-2 text-hacker-green">Status</TableHead>
                <TableHead className="text-right py-2 text-hacker-green">Hashrate</TableHead>
                <TableHead className="text-center py-2 text-hacker-green min-w-[120px]">Fuzzer</TableHead>
                <TableHead className="text-center py-2 text-hacker-green">Delete</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          
          <ScrollArea className={tableHeight}>
            <Table>
              <TableBody>
                {filteredMachines.map((machine) => (
                  <TableRow key={machine.ip} className="border-b border-hacker-border">
                    <TableCell className="py-3 font-mono flex items-center gap-2">
                      {machine.ip}
                      <Badge className={machine.role === "master" 
                        ? "bg-hacker-darkgreen text-white" 
                        : "bg-hacker-card text-gray-300 border border-gray-600"}
                      >
                        {machine.role === "master" ? "Master" : "Slave"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <span className={`status-dot ${machine.status === "active" ? "status-active" : "status-inactive"}`} />
                    </TableCell>
                    <TableCell className="py-3 font-mono text-right">
                      {machine.status === "active" ? `${machine.hashrate.toLocaleString()}` : "0"}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      {machine.status === "active" ? (
                        <Button
                          className="bg-hacker-darkred hover:bg-hacker-red text-white w-[100px]"
                          size="sm"
                          onClick={() => onStop(machine.ip)}
                          disabled={loading[`stop-${machine.ip}`] || loading[`start-${machine.ip}`]}
                        >
                          {loading[`stop-${machine.ip}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
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
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Start"
                          )}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-center">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        
        {newIpDialogOpen[type] ? (
          <div className="flex gap-2 items-center flex-wrap mt-2">
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
                setNewRole({ ...newRole, [type]: "slave" });
              }}
              className="text-hacker-red hover:bg-hacker-darkred"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setNewIpDialogOpen({ ...newIpDialogOpen, [type]: true })}
            className="bg-hacker-darkgreen hover:bg-hacker-green text-white mt-2"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {title} Machine
          </Button>
        )}
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
        <div className="flex gap-4 items-start">
          <ExecutionMetrics 
            totalExecs={totalExecs}
            coverage={coverage}
          />
          <TotalHashrate main={totalHashrateMain} variant={totalHashrateVariant} />
        </div>
      </div>
      
      {renderMachineTable("main", "Fuzzilli Main")}
      {renderMachineTable("variant", "Fuzzilli Variant")}
    </div>
  );
};

export default MachineStatus;
