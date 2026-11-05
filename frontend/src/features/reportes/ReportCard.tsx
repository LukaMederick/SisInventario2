import React from 'react';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  icon: any;
  badge: string;
  onExportExcel: () => void;
  onExportPdf?: () => void;
  loading: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title, description, icon: Icon, badge, onExportExcel, onExportPdf, loading,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-600 uppercase tracking-wider">
          {badge}
        </span>
      </div>
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{description}</p>
    </div>

    <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
      <button
        onClick={onExportExcel}
        disabled={loading}
        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />}
        Excel (.xlsx)
      </button>

      {onExportPdf && (
        <button
          onClick={onExportPdf}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <FileText className="w-3.5 h-3.5 mr-1.5" />}
          PDF (.pdf)
        </button>
      )}
    </div>
  </div>
);

