
import { Card } from "@/components/ui/card";

interface ExecutionMetricsProps {
  totalExecs: {
    main: number;
    variant: number;
  };
  coverage: {
    main: number;
    variant: number;
  };
}

const ExecutionMetrics = ({ totalExecs, coverage }: ExecutionMetricsProps) => {
  // Format large numbers with k, M, G suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + 'G';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col gap-2">
      <Card className="bg-hacker-card border border-hacker-border p-2">
        <div className="text-xs text-hacker-green font-semibold mb-1">Total Executions</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-hacker-green">
            Main: <span className="font-mono">{formatNumber(totalExecs.main)}</span>
          </div>
          <div className="text-hacker-blue">
            Variant: <span className="font-mono">{formatNumber(totalExecs.variant)}</span>
          </div>
        </div>
      </Card>
      
      <Card className="bg-hacker-card border border-hacker-border p-2">
        <div className="text-xs text-hacker-green font-semibold mb-1">Coverage</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-hacker-green">
            Main: <span className="font-mono">{coverage.main.toFixed(1)}%</span>
          </div>
          <div className="text-hacker-blue">
            Variant: <span className="font-mono">{coverage.variant.toFixed(1)}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExecutionMetrics;

