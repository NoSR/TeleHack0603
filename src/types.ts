/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromotionChannel {
  id: string;
  address: string;         // e.g., @groupname or https://t.me/groupname
  intervalSeconds: number; // Interval in seconds (초 단위)
  dailyQuota: number;      // Max promotions per day
  successCount: number;    // Counter of successful posts
  status: 'pending' | 'sending' | 'success' | 'resting' | 'failed' | 'idle';
  lastLog?: string;
}

export interface PromotionVariation {
  variationId: number;
  title: string;
  text: string;
  hookType: string;
  emojisUsed: string[];
}

export interface AntiSpamSettings {
  minDelaySec: number;     // Minimum random delay between posts
  maxDelaySec: number;     // Maximum random delay between posts
  restingPostCount: number; // Sleep after N posts
  restingMinutes: number;   // Sleep duration in minutes
  lazyMode: boolean;       // Mimics erratic human breaks
  randomChannelOrder?: boolean; // Scrambles order of channels dynamically
}

export interface TelegramSession {
  apiId: string;
  apiHash: string;
  phoneNumber: string;
  botToken?: string;
  useBotApi: boolean;
  isAuthorized: boolean;
  sessionString?: string;
  connectedAt?: string;
  accountUsername?: string;
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  channelAddress: string;
  status: '완료' | '지연대기' | '휴식중' | '실패';
  messageLink: string;
  textVersion: string;
  details: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string; // e.g., '*/15 * * * *' or Custom visual interval
  intervalMinutes: number;
  variationId: number;
  variationTitle: string;
  variationText: string;
  targetChannels: string[]; // channels string arrays
  isActive: boolean;
  createdAt: string;
  lastRunAt?: string;
  nextRunAt?: string;
  totalRuns: number;
  failures: number;
  retriesCount: number;
  autoRetryLimit: number;
}

export interface ScheduleHistoryLog {
  id: string;
  taskId: string;
  taskName: string;
  timestamp: string;
  status: 'SUCCESS' | 'RETRYING' | 'FAILED';
  channelAddress: string;
  textVersionTitle: string;
  details: string;
  attempt: number;
}

export interface BackendSystemStatus {
  dbConnected: boolean;
  schedulerActive: boolean;
  totalSchedules: number;
  activeSchedules: number;
  successRate: number;
  errorRecoveryRate: number;
  memoryUsage: string;
  uptimeSeconds: number;
}

export interface WebhookConfig {
  webhookUrl: string;
  platform: 'slack' | 'discord' | 'line' | 'custom_email';
  isEnabled: boolean;
  notifyOnFailure: boolean;
  notifyOnFloodLimit: boolean;
  notifyOnRestPeriod: boolean;
  customTemplate: string;
}

export interface AlertDispatchLog {
  id: string;
  timestamp: string;
  platform: 'slack' | 'discord' | 'line' | 'custom_email';
  triggerType: 'POST_FAILURE' | 'FLOOD_WARN' | 'ACCOUNT_RESTRICTION' | 'TEST';
  message: string;
  status: 'SENT' | 'FAILED';
  payloadSummary: string;
}

export interface AccountHealthMetric {
  spamChanceScore: number; // 0 to 100 percentage
  restrictionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  statusDescription: string;
  dailySendPercentage: number;
  totalSpamReports: number;
  sessionsLimitRemaining: number;
}



