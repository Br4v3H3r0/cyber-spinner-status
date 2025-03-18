
import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';

// Generate random data for the chart
const generateDataPoint = () => {
  return {
    time: new Date().toLocaleTimeString(),
    cpu: Math.floor(Math.random() * 60) + 20,
    memory: Math.floor(Math.random() * 60) + 20,
  };
};

const ResourceUsage = () => {
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [data, setData] = useState(() => {
    const initialData = [];
    for (let i = 0; i < 20; i++) {
      initialData.push(generateDataPoint());
    }
    return initialData;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Update data every second
    timerRef.current = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1), generateDataPoint()];
        return newData;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return (
    <div className="card-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-hacker-green neonGreen flex items-center gap-2">
          <span className="bg-hacker-darkgreen p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20" /><path d="M2 17h20" /><path d="M2 7h20" /></svg>
          </span>
          Resource Usage
        </h2>
        <Select value={selectedMachine} onValueChange={setSelectedMachine}>
          <SelectTrigger className="w-40 bg-hacker-card border-hacker-border text-white">
            <SelectValue placeholder="All Machines" />
          </SelectTrigger>
          <SelectContent className="bg-hacker-card border-hacker-border text-white">
            <SelectItem value="all">All Machines</SelectItem>
            <SelectItem value="192.168.1.101">192.168.1.101</SelectItem>
            <SelectItem value="192.168.1.102">192.168.1.102</SelectItem>
            <SelectItem value="192.168.1.103">192.168.1.103</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <XAxis dataKey="time" stroke="#555" tickFormatter={(value) => value.split(':')[2]} />
            <YAxis stroke="#555" domain={[0, 100]} />
            <CartesianGrid stroke="#333" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="cpu" 
              stroke="#ff3e3e" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="memory" 
              stroke="#1eff00" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResourceUsage;
