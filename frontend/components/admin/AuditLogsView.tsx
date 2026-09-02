"use client";

import React, { useState } from 'react';
import { AuditLog } from '../../lib/types';
import { MOCK_AUDIT_LOGS } from '../../lib/mockData';
import { History } from '../Icons';

export const AuditLogsView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" /> Immutable Audit Trail (Rule 10)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographic logging of all sensitive administrative, clinical override, and security events.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400">{log.action}</span>
                <span className="text-slate-400">• Actor: {log.user?.name || 'System Admin'}</span>
              </div>
              <span className="text-[11px] text-slate-500">{log.created_at}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto">
              {JSON.stringify(log.diff_payload, null, 2)}
            </div>

            <div className="text-[10px] text-slate-500">
              IP: {log.ip_address} • User-Agent: {log.user_agent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
