"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Database, Download, RotateCcw, Upload } from "lucide-react";
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
    <section className="mx-4 mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Database className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold tracking-wide text-slate-950">Master Data</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <Metric label="Users" value={dataContext.users.length} />
        <Metric label="Units" value={dataContext.units.length} />
        <Metric label="Tenants" value={dataContext.tenants.length} />
        <Metric label="Work orders" value={dataContext.issues.length} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="w-full border-slate-200 text-slate-700">
          <Upload className="h-3.5 w-3.5" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={onExport} className="w-full border-slate-200 text-slate-700">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} className="col-span-2 w-full text-slate-600">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Demo Data
        </Button>
      </div>
      <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileChange} />
      <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">{status}</p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="block font-semibold text-slate-950">{value}</span>
      <span>{label}</span>
    </div>
  );
}
