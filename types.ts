
export type OracleResponseType = 'IMAGE' | 'POEM' | 'SONIC';

export interface OracleResult {
  type: OracleResponseType;
  text: string;
  imageUrl?: string;
}

export interface HistoryItem {
  query: string;
  result: OracleResult;
  timestamp: number;
}
