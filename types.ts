export enum BotStatus {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

export interface FishProps {
  status: BotStatus;
}
