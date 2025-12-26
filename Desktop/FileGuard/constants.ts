import { ThreatLevel } from "./types";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit for this web demo
export const HEADER_BYTES_TO_READ = 64; // Read first 64 bytes for magic number check

export const THREAT_COLORS = {
  [ThreatLevel.SAFE]: 'text-emerald-400',
  [ThreatLevel.SUSPICIOUS]: 'text-amber-400',
  [ThreatLevel.DANGEROUS]: 'text-rose-500',
  [ThreatLevel.UNKNOWN]: 'text-slate-400',
};

export const THREAT_BG_COLORS = {
  [ThreatLevel.SAFE]: 'bg-emerald-500/10 border-emerald-500/20',
  [ThreatLevel.SUSPICIOUS]: 'bg-amber-500/10 border-amber-500/20',
  [ThreatLevel.DANGEROUS]: 'bg-rose-500/10 border-rose-500/20',
  [ThreatLevel.UNKNOWN]: 'bg-slate-500/10 border-slate-500/20',
};