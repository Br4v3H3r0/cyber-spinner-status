
import { useState } from "react";

interface ViewCrashesProps {
  onViewFile: (filename: string) => void;
}

const crashFiles = [
  "crash-1.js",
  "crash-2.js"
];

const ViewCrashes = ({ onViewFile }: ViewCrashesProps) => {
  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-hacker-green neonGreen mb-4 flex items-center gap-2">
        <span className="bg-hacker-darkgreen p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13V7" /><path d="M12 17h.01" /><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
        </span>
        View Crashes
      </h2>
      
      <div className="bg-hacker-background rounded border border-hacker-border">
        <ul className="p-4">
          {crashFiles.map((file) => (
            <li 
              key={file}
              onClick={() => onViewFile(file)}
              className="py-2 text-hacker-green cursor-pointer hover:text-white transition-colors"
            >
              {file}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewCrashes;
