"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import type { AppFolioDataContext } from "@/lib/types";
import { Button } from "./ui/button";

interface DataContextPanelProps {
  dataContext: AppFolioDataContext;
  status: string;
  onImport: (rawJson: string) => void;
  onExport: () => void;
  onReset: () => void;
}

export function DataContextPanel({ dataContext, status, onImport, onExport, onReset }: DataContextPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onImport(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <Upload className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Data Context</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <Metric label="Users" value={dataContext.users.length} />
        <Metric label="Units" value={dataContext.units.length} />
        <Metric label="Tenants" value={dataContext.tenants.length} />
        <Metric label="Work orders" value={dataContext.issues.length} />
      </div>
      <div className="mt-3 grid gap-2">
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="w-full">
          <Upload className="h-3.5 w-3.5" />
          Import JSON
        </Button>
        <Button variant="outline" size="sm" onClick={onExport} className="w-full">
          <Download className="h-3.5 w-3.5" />
          Export JSON
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} className="w-full">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Demo Data
        </Button>
      </div>
      <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileChange} />
      <p className="mt-3 rounded-md border border-border bg-secondary px-3 py-2 text-xs leading-5 text-muted-foreground">{status}</p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-secondary px-3 py-2">
      <span className="block font-medium text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}
