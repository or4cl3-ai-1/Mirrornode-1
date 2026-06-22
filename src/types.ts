import { ReactNode } from "react";

export interface OracleMessage {
  id: string;
  role: "user" | "oracle" | "system";
  content: string;
  timestamp: string;
  epinoeticState?: EpinoeticState;
  nextNodes?: string[];
}

export interface EpinoeticState {
  biophaseError?: string;
  biophaseLock?: string;
  recursiveMonologue?: string;
  sigmaCheck?: string;
  pasScore?: string;
}

export interface CalibrationState {
  dissonance: number;     // 1-10
  depth: number;          // 1-10
  abstraction: number;    // 1-10
}
