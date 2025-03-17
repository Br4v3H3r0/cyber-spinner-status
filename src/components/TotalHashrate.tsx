
import { Card } from "@/components/ui/card";

interface TotalHashrateProps {
  value: number;
}

const TotalHashrate = ({ value }: TotalHashrateProps) => {
  // Convert to Execs/s format
  const execsValue = value / 1000;
  
  return (
    <Card className="bg-hacker-card border border-hacker-border p-2">
      <div className="text-xs text-hacker-green font-semibold">Total Hashrate</div>
      <div className="text-xl font-bold font-mono">
        {execsValue.toFixed(2)}
        <span className="text-sm ml-1 text-gray-400">Execs/s</span>
      </div>
    </Card>
  );
};

export default TotalHashrate;
