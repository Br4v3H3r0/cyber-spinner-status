
import { Card } from "@/components/ui/card";

interface TotalHashrateProps {
  main: number;
  variant: number;
}

const TotalHashrate = ({ main, variant }: TotalHashrateProps) => {
  // Convert to Execs/s format
  const total = main + variant;
  const mainExecsValue = main / 1000;
  const variantExecsValue = variant / 1000;
  const totalExecsValue = total / 1000;
  
  return (
    <Card className="bg-hacker-card border border-hacker-border p-2 h-full flex flex-col justify-between">
      <div>
        <div className="text-xs text-hacker-green font-semibold">Total Hashrate</div>
        <div className="text-xl font-bold font-mono mt-1">
          {totalExecsValue.toFixed(2)}
          <span className="text-sm ml-1 text-gray-400">Execs/s</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-auto text-xs">
        <div className="text-hacker-green">
          Main: <span className="font-mono">{mainExecsValue.toFixed(2)}</span>
          <span className="text-gray-400 ml-1">Execs/s</span>
        </div>
        <div className="text-hacker-blue">
          Variant: <span className="font-mono">{variantExecsValue.toFixed(2)}</span>
          <span className="text-gray-400 ml-1">Execs/s</span>
        </div>
      </div>
    </Card>
  );
};

export default TotalHashrate;
