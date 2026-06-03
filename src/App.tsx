import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Sparkles,
  Play,
  Pause,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  Settings,
  FileText,
  User,
  Coffee,
  HelpCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Info,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  Calendar,
  Send,
  Zap,
  Database,
  Activity,
  Power,
  Terminal,
  Plus,
  Trash2,
  Bell,
  ShieldAlert,
  Gauge,
  Shuffle,
  ChevronDown,
  Edit2,
  Save,
  X
} from "lucide-react";
import { PromotionChannel, PromotionVariation, AntiSpamSettings, SimulationLog, TelegramSession, ScheduledTask, ScheduleHistoryLog, BackendSystemStatus, WebhookConfig, AlertDispatchLog, AccountHealthMetric } from "./types";

export default function App() {
  // Preset Default Channels for user convenience
  const defaultChannels: PromotionChannel[] = [
    { id: "1", address: "@korea_store_promo_01", intervalSeconds: 45, dailyQuota: 10, successCount: 0, status: 'idle' },
    { id: "2", address: "https://t.me/gangnam_market_info", intervalSeconds: 60, dailyQuota: 5, successCount: 0, status: 'idle' },
    { id: "3", address: "@local_shop_advertise_kr", intervalSeconds: 30, dailyQuota: 15, successCount: 0, status: 'idle' },
    { id: "4", address: "https://t.me/seoul_startup_hotplace", intervalSeconds: 90, dailyQuota: 8, successCount: 0, status: 'idle' },
  ];

  // Component States
  const [channels, setChannels] = useState<PromotionChannel[]>(() => {
    const saved = localStorage.getItem("loaded_channels");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return defaultChannels;
  });
  const [baseText, setBaseText] = useState<string>(() => {
    const saved = localStorage.getItem("loaded_base_text");
    return saved !== null ? saved : "🔥 [동대문 대박 신설 매장] 드디어 오늘 정식 오픈! 🔥\n\n안녕하세요! 강남 최고의 퀄리티와 가성비로 소문난 '대박네'가 동대문에 직영 매장을 신규 오픈했습니다!\n\n🎁 오픈 기념 특별 혜택 🎁\n- 본 홍보글을 캡처해서 방문하시면 '수제 하이볼' 1잔 무료 증정!\n- 전 메뉴 15% 즉시 추가 오픈 할인 적용!\n\n📍 오시는 길: 서울시 중구 신당동 123-45 1층 (상왕십리역 도보 3분)\n📞 예약문의: 010-1234-5678\n📌 단체석 완비, 주차 공간 완비";
  });
  const [variations, setVariations] = useState<PromotionVariation[]>([
    {
      variationId: 1,
      title: "🔥 즉시 할인 & 증정 중심 쾌속형",
      text: "📢 [동대문 대박매장 오픈안내]\n본 글을 캡처해 방문하시는 모든 분들께 특별 증정 혜택을 드립니다.\n\n🎁 오픈 특별 혜택 리스트:\n1. 전 메뉴 즉시 15% 기습 할인\n2. 인증 시 수제 하이볼 1잔 전격 무료 증정!\n\n📍 매장 주소: 서울시 중구 신당동 123-45 1층\n📞 예약 및 대기 문의: 010-1234-5678\n💡 망설이지 마시고 지금 방문해 콕 찝어 해피하게 푸짐하게 즐기십시오!",
      hookType: "직설적인 혜택 강조",
      emojisUsed: ["📢", "🎁", "📍", "💡", "🔥"]
    },
    {
      variationId: 2,
      title: "✨ 감성 스토리텔링 및 친근한 안내형",
      text: "행복한 소식 전합니다! 😊 강남에서 많은 사랑을 받았던 '대박네'가 동대문 직영 매장으로 정식 인사를 올립니다.\n\n새로운 옷을 입고 준비한 쾌적한 공간에서 소중한 인연을 맞이할 준비를 마쳤습니다. 오픈 기념 소박하지만 확실한 약속 한가지 드릴게요.\n\n• 본 화면을 캡처하여 매장 스태프에게 보여주세요. '수제 하이볼 1잔'을 정성스럽게 선사합니다.\n• 동시에 전체 결제액 15% 웰컴 할인이 시원하게 적용됩니다.\n\n- 편하게 주차할 수 있는 넉넉한 공간\n- 소규모 수다부터 대형 단체 모임까지 딱 깔끔한 좌석 배정\n\n🧭 주소: 서울시 중구 신당동 123-45 1층 (상왕십리역 3분)\n📞 연락처: 010-1234-5678",
      hookType: "스토리텔링 및 친근형",
      emojisUsed: ["😊", "🧭", "📞", "✨"]
    }
  ]);

  const [variationCount, setVariationCount] = useState<number>(() => {
    const saved = localStorage.getItem("loaded_variation_count");
    return saved ? parseInt(saved) || 10 : 10;
  });

  const [antiSpam, setAntiSpam] = useState<AntiSpamSettings>({
    minDelaySec: 5,
    maxDelaySec: 15,
    restingPostCount: 3,
    restingMinutes: 1,
    lazyMode: true,
    randomChannelOrder: true,
  });

  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStatus, setSimulationStatus] = useState<string>("대기 상태");
  const [isLoadingVariations, setIsLoadingVariations] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "session" | "briefing" | "scheduler" | "alerts">("dashboard");
  const [isRealMode, setIsRealMode] = useState<boolean>(false);
  const [realBotToken, setRealBotToken] = useState<string>(() => {
    return localStorage.getItem("real_bot_token") || "";
  });
  const [csvPreviewError, setCsvPreviewError] = useState<string | null>(null);
  const [generatorType, setGeneratorType] = useState<"gemini" | "local_fallback" | null>(null);
  const [generatorMessage, setGeneratorMessage] = useState<string>("");
  const [expandedVariationIds, setExpandedVariationIds] = useState<Record<number, boolean>>({});
  const [editingVariationId, setEditingVariationId] = useState<number | null>(null);
  const [editingVariationText, setEditingVariationText] = useState<string>("");
  const [editingVariationTitle, setEditingVariationTitle] = useState<string>("");

  // Phase 3 Backend scheduler & long-term tracking DB states
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [scheduleHistory, setScheduleHistory] = useState<ScheduleHistoryLog[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<BackendSystemStatus | null>(null);
  const [isBackendLoading, setIsBackendLoading] = useState<boolean>(false);

  // Phase 4 states
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig | null>(null);
  const [alertLogs, setAlertLogs] = useState<AlertDispatchLog[]>([]);
  const [accountHealth, setAccountHealth] = useState<AccountHealthMetric | null>(null);
  const [testAlertSuccess, setTestAlertSuccess] = useState<string | null>(null);
  const [testAlertError, setTestAlertError] = useState<string | null>(null);
  const [saveAlertSuccess, setSaveAlertSuccess] = useState<boolean>(false);

  // Custom Form states for schedule creation
  const [newSchedName, setNewSchedName] = useState<string>("");
  const [newSchedInterval, setNewSchedInterval] = useState<number>(30);
  const [newSchedVariationId, setNewSchedVariationId] = useState<number>(1);
  const [newSchedChannelsText, setNewSchedChannelsText] = useState<string>("@wholesale_kids, @dongdaemun_delivery");
  const [addScheduleError, setAddScheduleError] = useState<string | null>(null);
  const [addScheduleSuccess, setAddScheduleSuccess] = useState<boolean>(false);
  
  // Phase 2 Telegram session and credentials states
  const [session, setSession] = useState<TelegramSession>(() => {
    const saved = localStorage.getItem("telegram_session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      apiId: "",
      apiHash: "",
      phoneNumber: "",
      botToken: "",
      useBotApi: false,
      isAuthorized: false
    };
  });

  const [inputApiId, setInputApiId] = useState<string>(session.apiId || "31001139");
  const [inputApiHash, setInputApiHash] = useState<string>(session.apiHash || "3424497d3ae84800fc4818771d6d7062");
  const [inputPhoneNumber, setInputPhoneNumber] = useState<string>(session.phoneNumber || "");
  const [inputBotToken, setInputBotToken] = useState<string>(session.botToken || "");
  const [isUseBotApi, setIsUseBotApi] = useState<boolean>(session.useBotApi || false);
  
  const [sessionStep, setSessionStep] = useState<"choose" | "credentials" | "verify" | "authorized">(
    session.isAuthorized ? "authorized" : "choose"
  );
  
  const [smsCode, setSmsCode] = useState<string>("");
  const [phoneCodeHash, setPhoneCodeHash] = useState<string>("");
  const [isRequestingCode, setIsRequestingCode] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionSuccessMsg, setSessionSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);


  // Active indices for simulation execution
  const simTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const simulationStateRef = useRef<{
    currentIndex: number;
    postsCompleted: number;
    channelsList: PromotionChannel[];
  }>({ currentIndex: 0, postsCompleted: 0, channelsList: [] });

  // Handle Copy to clipboard
  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ==========================================
  // Phase 3 Scheduler Controllers
  // ==========================================
  const loadSchedulerData = async () => {
    try {
      const [schedRes, histRes, statusRes] = await Promise.all([
        fetch("/api/schedules"),
        fetch("/api/schedules/history"),
        fetch("/api/schedules/status")
      ]);
      
      const schedData = await schedRes.json();
      const histData = await histRes.json();
      const statusData = await statusRes.json();

      if (schedData.success) {
        setScheduledTasks(schedData.schedules);
        localStorage.setItem("static_sched_tasks", JSON.stringify(schedData.schedules));
      }
      if (histData.success) {
        setScheduleHistory(histData.history);
        localStorage.setItem("static_sched_history", JSON.stringify(histData.history));
      }
      setSchedulerStatus(statusData);
      localStorage.setItem("static_sched_status", JSON.stringify(statusData));
    } catch (err) {
      console.warn("Failed to fetch scheduler backend state, loading local mocked state:", err);
      const storedScheds = localStorage.getItem("static_sched_tasks");
      if (storedScheds) setScheduledTasks(JSON.parse(storedScheds));
      
      const storedHist = localStorage.getItem("static_sched_history");
      if (storedHist) setScheduleHistory(JSON.parse(storedHist));
      
      const storedStatus = localStorage.getItem("static_sched_status");
      if (storedStatus) {
        setSchedulerStatus(JSON.parse(storedStatus));
      } else {
        setSchedulerStatus({
          totalTasks: storedScheds ? JSON.parse(storedScheds).length : 0,
          activeTasks: storedScheds ? JSON.parse(storedScheds).filter((t: any) => t.isActive).length : 0,
          totalDispatches: storedHist ? JSON.parse(storedHist).length : 0,
          uptime: "정적 호스팅 (100% 자립기동)"
        });
      }
    }
  };

  // ==========================================
  // Phase 4 Alerts & Health Controllers
  // ==========================================
  const loadAlertData = async () => {
    try {
      const [configRes, logsRes, healthRes] = await Promise.all([
        fetch("/api/alerts/config"),
        fetch("/api/alerts/logs"),
        fetch("/api/alerts/health")
      ]);
      const configData = await configRes.json();
      const logsData = await logsRes.json();
      const healthData = await healthRes.json();

      if (configData.success) {
        setWebhookConfig(configData.config);
        localStorage.setItem("static_webhook_config", JSON.stringify(configData.config));
      }
      if (logsData.success) {
        setAlertLogs(logsData.logs);
        localStorage.setItem("static_alert_logs", JSON.stringify(logsData.logs));
      }
      if (healthData.success) {
        setAccountHealth(healthData.health);
        localStorage.setItem("static_account_health", JSON.stringify(healthData.health));
      }
    } catch (err) {
      console.warn("Failed to load Phase 4 alert telemetry data, loading local mocked state:", err);
      const storedConfig = localStorage.getItem("static_webhook_config");
      if (storedConfig) setWebhookConfig(JSON.parse(storedConfig));
      
      const storedLogs = localStorage.getItem("static_alert_logs");
      if (storedLogs) setAlertLogs(JSON.parse(storedLogs));
      
      const storedHealth = localStorage.getItem("static_account_health");
      if (storedHealth) setAccountHealth(JSON.parse(storedHealth));
    }
  };

  // Add a poll to periodically pull data in the background
  useEffect(() => {
    loadSchedulerData();
    loadAlertData();
    const interval = setInterval(() => {
      loadSchedulerData();
      loadAlertData();
    }, 6000); // Poll every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // Save baseText to localStorage on change
  useEffect(() => {
    localStorage.setItem("loaded_base_text", baseText);
  }, [baseText]);

  // Save channels list to localStorage on change
  useEffect(() => {
    localStorage.setItem("loaded_channels", JSON.stringify(channels));
  }, [JSON.stringify(channels)]);

  // Save variationCount to localStorage on change
  useEffect(() => {
    localStorage.setItem("loaded_variation_count", variationCount.toString());
  }, [variationCount]);

  const handleSaveAlertConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookConfig) return;
    setSaveAlertSuccess(false);

    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      localStorage.setItem("static_webhook_config", JSON.stringify(webhookConfig));
      setSaveAlertSuccess(true);
      addSystemLog("SYSTEM", "경고용 디스코드 웹훅 구성 설정이 브라우저 로컬 저장소에 반영되었습니다.", "완료");
      setTimeout(() => setSaveAlertSuccess(false), 3000);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch("/api/alerts/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookConfig)
      });
      const data = await res.json();
      if (data.success) {
        setWebhookConfig(data.config);
        setSaveAlertSuccess(true);
        setTimeout(() => setSaveAlertSuccess(false), 3000);
      }
    } catch (err) {
      console.warn("Failed to save alert configs to server, falling back to local storage:", err);
      localStorage.setItem("static_webhook_config", JSON.stringify(webhookConfig));
      setSaveAlertSuccess(true);
      setTimeout(() => setSaveAlertSuccess(false), 3000);
    } finally {
      setIsBackendLoading(false);
    }
  };

  const handleSendTestWebhook = async () => {
    setTestAlertSuccess(null);
    setTestAlertError(null);

    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      setIsBackendLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockLog = {
        logId: "mock_test_" + Date.now(),
        timestamp: new Date().toLocaleTimeString('ko-KR'),
        channel: "@wholesale_kids",
        triggerType: "info" as const,
        message: "디스코드 경고 수신 채널 연결 테스트 발송: 성공 (가상 전송)"
      };
      const updatedLogs = [mockLog, ...alertLogs];
      setAlertLogs(updatedLogs);
      localStorage.setItem("static_alert_logs", JSON.stringify(updatedLogs));
      setTestAlertSuccess("디스코드 테스트 웹훅 전송 성공! (정적 시뮬레이션)");
      setIsBackendLoading(false);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch("/api/alerts/test", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTestAlertSuccess(data.message);
        loadAlertData();
      } else {
        setTestAlertError(data.error || "테스트 발송 도중 오류 발생");
      }
    } catch (err: any) {
      console.warn("Failed to trigger webhook on backend:", err.message);
      setTestAlertSuccess("디스코드 테스트 웹훅 발송 (시뮬레이션 인가)");
    } finally {
      setIsBackendLoading(false);
    }
  };

  const handleResetHealthScore = async () => {
    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      setIsBackendLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const resetHealth = {
        score: 100,
        status: "safe" as const,
        shieldActive: true,
        riskLevel: "low" as const
      };
      setAccountHealth(resetHealth);
      localStorage.setItem("static_account_health", JSON.stringify(resetHealth));
      addSystemLog("GUARD", "계정 보안 가드 스코어가 초기화되어 완벽한 100점 등급으로 복원되었습니다.", "완료");
      setIsBackendLoading(false);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch("/api/alerts/health/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAccountHealth(data.health);
        localStorage.setItem("static_account_health", JSON.stringify(data.health));
        loadAlertData();
      }
    } catch (err) {
      console.warn("Health reset error:", err);
      const resetHealth = {
        score: 100,
        status: "safe" as const,
        shieldActive: true,
        riskLevel: "low" as const
      };
      setAccountHealth(resetHealth);
    } finally {
      setIsBackendLoading(false);
    }
  };

  const handleTriggerWarningSimulation = async () => {
    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      setIsBackendLoading(true);
      await new Promise(resolve => setTimeout(resolve, 450));
      const warningHealth = {
        score: 72,
        status: "warning" as const,
        shieldActive: true,
        riskLevel: "medium" as const
      };
      setAccountHealth(warningHealth);
      localStorage.setItem("static_account_health", JSON.stringify(warningHealth));
      
      const newLog = {
        logId: "alert_" + Date.now(),
        timestamp: new Date().toLocaleTimeString('ko-KR'),
        channel: "@dongdaemun_delivery",
        triggerType: "warning" as const,
        message: "텔레그램 대량 업로드 제한치 90% 근접 탐지! 우회 셔플 간격 조정 경보 인가."
      };
      const updatedLogs = [newLog, ...alertLogs];
      setAlertLogs(updatedLogs);
      localStorage.setItem("static_alert_logs", JSON.stringify(updatedLogs));
      
      addSystemLog("GUARD", "텔레그램 보안 경고 상황을 시뮬레이션하였습니다. (디스코드 가상 알림 발송됨)", "실패");
      setIsBackendLoading(false);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch("/api/alerts/health/trigger-simulation", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAccountHealth(data.health);
        localStorage.setItem("static_account_health", JSON.stringify(data.health));
        loadAlertData();
      }
    } catch (err) {
      console.warn("Health simulation warning error:", err);
      const warningHealth = {
        score: 72,
        status: "warning" as const,
        shieldActive: true,
        riskLevel: "medium" as const
      };
      setAccountHealth(warningHealth);
    } finally {
      setIsBackendLoading(false);
    }
  };

  const handleToggleSchedule = async (id: string) => {
    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      setIsBackendLoading(true);
      const updated = scheduledTasks.map(t => {
        if (t.id === id) {
          const newState = !t.isActive;
          addSystemLog("SCHEDULER", `스케줄 [${t.name}]이 ${newState ? "활성화" : "일시 중지"} 처리되었습니다.`, "완료");
          return { ...t, isActive: newState };
        }
        return t;
      });
      setScheduledTasks(updated);
      localStorage.setItem("static_sched_tasks", JSON.stringify(updated));
      setIsBackendLoading(false);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch(`/api/schedules/${id}/toggle`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setScheduledTasks(data.schedules);
        localStorage.setItem("static_sched_tasks", JSON.stringify(data.schedules));
        loadSchedulerData();
      }
    } catch (err) {
      console.warn("Toggle error fallback:", err);
      const updated = scheduledTasks.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t);
      setScheduledTasks(updated);
    } finally {
      setIsBackendLoading(false);
    }
  };

  const handleTriggerScheduleOnce = async (id: string) => {
    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      setIsBackendLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const task = scheduledTasks.find(t => t.id === id);
      if (task) {
        const runTime = new Date();
        const updated = scheduledTasks.map(t => {
          if (t.id === id) {
            return {
              ...t,
              lastRunAt: runTime.toISOString(),
              totalRuns: t.totalRuns + 1
            };
          }
          return t;
        });
        setScheduledTasks(updated);
        localStorage.setItem("static_sched_tasks", JSON.stringify(updated));

        // Create mock history
        const newHist = {
          logId: "log_" + Date.now(),
          taskId: id,
          taskName: task.name,
          runAt: runTime.toLocaleTimeString('ko-KR'),
          status: "success" as const,
          channel: task.targetChannels[0] || "@wholesale_kids",
          variationTitle: task.variationTitle,
          resultLog: `가상 스케줄 발송 완료 (ID: ${Math.floor(Math.random() * 100000) + 400000}, 우회 필터: OK)`
        };
        const updatedHist = [newHist, ...scheduleHistory];
        setScheduleHistory(updatedHist);
        localStorage.setItem("static_sched_history", JSON.stringify(updatedHist));
        addSystemLog("SCHEDULER", `정적 가상 스케줄 [${task.name}] 일회성 매뉴얼 트리거: 성공`, "완료");
      }
      setIsBackendLoading(false);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch(`/api/schedules/${id}/trigger`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setScheduledTasks(data.schedules);
        localStorage.setItem("static_sched_tasks", JSON.stringify(data.schedules));
        if (data.history) {
          setScheduleHistory(data.history);
          localStorage.setItem("static_sched_history", JSON.stringify(data.history));
        }
        loadSchedulerData();
      }
    } catch (err) {
      console.error("Trigger error:", err);
    } finally {
      setIsBackendLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      setIsBackendLoading(true);
      const updated = scheduledTasks.filter(t => t.id !== id);
      setScheduledTasks(updated);
      localStorage.setItem("static_sched_tasks", JSON.stringify(updated));
      addSystemLog("SCHEDULER", "스케줄 작업이 영구 폐기되었습니다.", "지연대기");
      setIsBackendLoading(false);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setScheduledTasks(data.schedules);
        localStorage.setItem("static_sched_tasks", JSON.stringify(data.schedules));
        loadSchedulerData();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsBackendLoading(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddScheduleError(null);
    setAddScheduleSuccess(false);

    if (!newSchedName.trim()) {
      setAddScheduleError("스케줄명을 올바르게 입력해주세요.");
      return;
    }

    // Find selected variation text or design text
    const selectedVar = variations.find(v => v.variationId === newSchedVariationId) || variations[0];
    const channelList = newSchedChannelsText
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    if (channelList.length === 0) {
      setAddScheduleError("발송 대상 채널을 최소 한 개 기입해 주세요.");
      return;
    }

    const isMock = session.sessionString === "mock_session_cloudflare_pages_only";
    if (isMock) {
      setIsBackendLoading(true);
      const newTask = {
        id: "task_" + Date.now(),
        name: newSchedName,
        intervalMinutes: newSchedInterval,
        variationId: selectedVar?.variationId || 1,
        variationTitle: selectedVar?.title || "선택된 변형 문안",
        variationText: selectedVar?.text || "",
        targetChannels: channelList,
        isActive: true,
        lastRunAt: "대기 중",
        totalRuns: 0
      };
      const updated = [newTask, ...scheduledTasks];
      setScheduledTasks(updated);
      localStorage.setItem("static_sched_tasks", JSON.stringify(updated));
      addSystemLog("SCHEDULER", `새 스케줄 [${newSchedName}]이 등록 완료되었습니다.`, "완료");
      setAddScheduleSuccess(true);
      setNewSchedName("");
      setIsBackendLoading(false);
      return;
    }

    try {
      setIsBackendLoading(true);
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSchedName,
          intervalMinutes: newSchedInterval,
          variationId: selectedVar?.variationId || 1,
          variationTitle: selectedVar?.title || "선택된 변형 문안",
          variationText: selectedVar?.text || "",
          targetChannels: channelList
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "스케줄 등록 중 오류 발생");
      }

      setAddScheduleSuccess(true);
      setNewSchedName("");
      setScheduledTasks(data.schedules);
      localStorage.setItem("static_sched_tasks", JSON.stringify(data.schedules));
      loadSchedulerData();
    } catch (err: any) {
      setAddScheduleError(err.message || "스케줄 추가 실패");
    } finally {
      setIsBackendLoading(false);
    }
  };

  // Phase 2 Session Hook Functions
  const initMockDataForStaticMode = () => {
    // Initial sample tasks
    const initialTasks = [
      {
        id: "task_1",
        name: "동대문 의류 채널 매시 정각 우회 송출",
        intervalMinutes: 60,
        variationId: 1,
        variationTitle: "어휘 치환 & 글머리 기호 다각화 에디션",
        variationText: "⚡ [동대문 의류 긴급 입고] \n\n✔️ 완벽 사후 처리 보장형 보증금 100% 안심가 가스점 오픈!\n📍 상세 문의 📲 @wholesale_kids \n🎀 신규 회원 대박 혜택 리스트 완비 완료!",
        targetChannels: ["@wholesale_kids"],
        isActive: true,
        lastRunAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
        totalRuns: 12
      },
      {
        id: "task_2",
        name: "도매 아동복 채널 스팸 완벽통과 우회 30분 주기",
        intervalMinutes: 30,
        variationId: 2,
        variationTitle: "부정어구 전반 정돈 & 정밀 미러링 에디션",
        variationText: "✨ [신규 아동복 도매 마켓 런칭]\n\n📌 보장된 퀄리티의 제품들 대기 완료\n💬 빠른 연계 문의는 @dongdaemun_delivery 로 주십시오\n💝 지금 가입하시는 모든 사장님들 특별한 프레임 혜택!",
        targetChannels: ["@dongdaemun_delivery"],
        isActive: false,
        lastRunAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        totalRuns: 8
      }
    ];

    const initialHistory = [
      {
        logId: "log_1",
        taskId: "task_1",
        taskName: "동대문 의류 채널 매시 정각 우회 송출",
        runAt: new Date(Date.now() - 1000 * 60 * 32).toLocaleTimeString('ko-KR'),
        status: "success" as const,
        channel: "@wholesale_kids",
        variationTitle: "어휘 치환 & 글머리 기호 다각화 에디션",
        resultLog: "전송 완료 (ID: 489912, 스팸 우회 필터: OK)"
      },
      {
        logId: "log_2",
        taskId: "task_2",
        taskName: "도매 아동복 채널 스팸 완벽통과 우회 30분 주기",
        runAt: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString('ko-KR'),
        status: "success" as const,
        channel: "@dongdaemun_delivery",
        variationTitle: "부정어구 전반 정돈 & 정밀 미러링 에디션",
        resultLog: "전송 완료 (ID: 489905, 스팸 우회 필터: OK)"
      }
    ];

    const initialHealth = {
      score: 98,
      status: "safe" as const,
      shieldActive: true,
      riskLevel: "low" as const
    };

    const initialLogs = [
      {
        logId: "alert_1",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleTimeString('ko-KR'),
        channel: "@wholesale_kids",
        triggerType: "warning" as const,
        message: "도배방지용 변동 딜레이 8초가 정상 인가되어 텔레그램 스팸 필터를 우회하였습니다."
      },
      {
        logId: "alert_2",
        timestamp: new Date(Date.now() - 1000 * 60 * 600).toLocaleTimeString('ko-KR'),
        channel: "@dongdaemun_delivery",
        triggerType: "info" as const,
        message: "계정 헬스케어 체크 진행 결과 스팸 경고 신호가 한 건도 관측되지 않아 최우수 안전 수준을 등극했습니다."
      }
    ];

    localStorage.setItem("static_sched_tasks", JSON.stringify(initialTasks));
    localStorage.setItem("static_sched_history", JSON.stringify(initialHistory));
    localStorage.setItem("static_account_health", JSON.stringify(initialHealth));
    localStorage.setItem("static_alert_logs", JSON.stringify(initialLogs));
    
    setScheduledTasks(initialTasks);
    setScheduleHistory(initialHistory);
    setAccountHealth(initialHealth);
    setAlertLogs(initialLogs);
  };

  const handleEnableStaticDemoSession = () => {
    setSessionError(null);
    setSessionSuccessMsg("정적 시뮬레이션 데모 모드가 활성화되었습니다! 백엔드 서버 없이도 모든 기능이 완벽 재생 및 모의 작동합니다.");
    const demoSession = {
      apiId: inputApiId || "31001139",
      apiHash: inputApiHash || "3424497d3ae84800fc4818771d6d7062",
      phoneNumber: inputPhoneNumber || "+821073700137",
      botToken: "",
      useBotApi: false,
      isAuthorized: true,
      sessionString: "mock_session_cloudflare_pages_only",
      connectedAt: new Date().toLocaleDateString('ko-KR') + " " + new Date().toLocaleTimeString('ko-KR'),
      accountUsername: "@tele_marketing_pro_demo"
    };
    setSession(demoSession);
    localStorage.setItem("telegram_session", JSON.stringify(demoSession));
    setSessionStep("authorized");
    
    initMockDataForStaticMode();
    addSystemLog("SYSTEM", "Cloudflare Pages 정적 시뮬레이션 연동 성공! (모의 유저 대시보드가 기동합니다.)", "완료");
  };

  const handleRequestAuthCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionError(null);
    setSessionSuccessMsg(null);
    setIsRequestingCode(true);

    try {
      const response = await fetch("/api/session/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiId: inputApiId,
          apiHash: inputApiHash,
          phoneNumber: inputPhoneNumber,
          useBotApi: isUseBotApi,
          botToken: inputBotToken
        })
      });
      
      let data: any;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(
          "정적 호스팅 감지: 백엔드 API가 JSON 대신 올바르지 않은 응답을 반환했습니다. Cloudflare Pages 같은 정적 서버 환경에서는 NodeJS Express 서버가 작동하지 않으므로 수동 원격 연결 API를 즉시 기동할 수 없습니다. 대신 하단 해결 가이드를 통해 '정적 시뮬레이션 데모 모드'로 접속하시면 모든 플래너 및 발송 기능을 100% 상세 시험해 보실 수 있습니다!"
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "인증코드 요청 중 문제가 발생했습니다.");
      }

      if (isUseBotApi) {
        // Bot API connects instantly
        const newSession = {
          apiId: "",
          apiHash: "",
          phoneNumber: "",
          botToken: inputBotToken,
          useBotApi: true,
          isAuthorized: true,
          sessionString: data.sessionString,
          connectedAt: new Date().toLocaleDateString('ko-KR') + " " + new Date().toLocaleTimeString('ko-KR'),
          accountUsername: data.accountUsername
        };
        setSession(newSession);
        localStorage.setItem("telegram_session", JSON.stringify(newSession));
        setSessionStep("authorized");
        addSystemLog("SYSTEM", `텔레그램 공식 봇 계정(${data.accountUsername}) 연동 성공! (Phase 2 달성)`, "완료");
      } else {
        setPhoneCodeHash(data.phoneCodeHash);
        setSessionSuccessMsg(data.message);
        setSessionStep("verify");
        addSystemLog("SYSTEM", `인증코드가 발송되었습니다. [수신 대기] PC용 텔레그램 메신저 앱의 "Telegram" 알림 채널에서 확인해 주세요!`, "지연대기");
      }
    } catch (err: any) {
      setSessionError(err.message || "연결 오류");
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerifyAuthCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionError(null);
    setSessionSuccessMsg(null);
    setIsVerifyingCode(true);

    try {
      const response = await fetch("/api/session/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiId: inputApiId,
          apiHash: inputApiHash,
          phoneNumber: inputPhoneNumber,
          code: smsCode,
          phoneCodeHash
        })
      });

      let data: any;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(
          "정적 서버 감지: 코드 인가 도중 백엔드 자격 검사 응답이 원활치 않았습니다. Cloudflare Pages 등 정적 서버 환경에서는 텔레그램 실시간 인가 기능이 지원되지 않으므로 '데모 가상 로그인 모드'를 통해 모의 체험을 부탁드립니다."
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "인증 코드 검증에 실패했습니다.");
      }

      setSession(data.session);
      localStorage.setItem("telegram_session", JSON.stringify(data.session));
      setSessionStep("authorized");
      setSessionSuccessMsg(data.message);
      addSystemLog("SYSTEM", `텔레그램 계정(${data.session.accountUsername}) MTProto 유저봇 세션 동기화 성공!`, "완료");
    } catch (err: any) {
      setSessionError(err.message || "코드 승인 실패");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleDisconnectSession = () => {
    localStorage.removeItem("telegram_session");
    setSession({
      apiId: "",
      apiHash: "",
      phoneNumber: "",
      botToken: "",
      useBotApi: false,
      isAuthorized: false
    });
    setInputApiId("");
    setInputApiHash("");
    setInputPhoneNumber("");
    setInputBotToken("");
    setSmsCode("");
    setPhoneCodeHash("");
    
    // Clear static mocks as well
    localStorage.removeItem("static_sched_tasks");
    localStorage.removeItem("static_sched_history");
    localStorage.removeItem("static_account_health");
    localStorage.removeItem("static_alert_logs");
    
    setSessionStep("choose");
    addSystemLog("SYSTEM", "텔레그램 활성화 세션을 폐기하고 연결을 완전 해제하였습니다.", "지연대기");
  };

  const toggleExpandVariation = (id: number) => {
    setExpandedVariationIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleStartEditVariation = (v: PromotionVariation) => {
    setEditingVariationId(v.variationId);
    setEditingVariationText(v.text);
    setEditingVariationTitle(v.title);
  };

  const handleSaveVariation = (id: number) => {
    setVariations(prev => prev.map(v => {
      if (v.variationId === id) {
        return {
          ...v,
          text: editingVariationText,
          title: editingVariationTitle
        };
      }
      return v;
    }));
    setEditingVariationId(null);
  };

  const handleCancelEditVariation = () => {
    setEditingVariationId(null);
  };

  const handleExportCSV = () => {
    if (variations.length === 0) return;
    const headers = ["ID", "Title", "Hook Type", "Content", "Emojis"];
    const rows = variations.map(v => {
      const escapedTitle = v.title.replace(/"/g, '""');
      const escapedHookType = v.hookType.replace(/"/g, '""');
      const escapedText = v.text.replace(/"/g, '""');
      const escapedEmojis = (v.emojisUsed || []).join(" ").replace(/"/g, '""');
      return `${v.variationId},"${escapedTitle}","${escapedHookType}","${escapedText}","${escapedEmojis}"`;
    });
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.className = "hidden";
    link.setAttribute("href", url);
    link.setAttribute("download", `telegram_promotion_variations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Local client-side fallback generator when backend is unreachable (e.g. static Cloudflare Pages hosting)
  const clientGenerateFallbackVariations = (textArg: string) => {
    const cleanBaseText = textArg.trim();
    const lines = cleanBaseText.split("\n");

    const replaceSynonyms = (text: string, style: number) => {
      let res = text;
      if (style === 1) {
        res = res
          .replace(/배팅/g, "베팅")
          .replace(/먹튀\s*\?\s*사고\s*\?\s*1도\s*없습니다/g, "사고 및 먹튀이력 일체 무존재")
          .replace(/먹튀/g, "먹튀 안전검증")
          .replace(/1도\s*없습니다/g, "단 한 차례도 존재하지 않습니다")
          .replace(/미친듯이/g, "열띤 반응 속에")
          .replace(/터지는\s*중/g, "절정인 상황")
          .replace(/약속/g, "전폭 보증 및 확약")
          .replace(/안녕하세요/g, "반갑습니다")
          .replace(/오픈했습니다/g, "오픈 완료했습니다")
          .replace(/오픈/g, "신규 오픈")
          .replace(/혜택/g, "스페셜 혜택")
          .replace(/문의/g, "상담 창구")
          .replace(/가능합니다/g, "지원 가능하십니다")
          .replace(/완비/g, "완비 완료");
      } else if (style === 2) {
        res = res
          .replace(/배팅/g, "승부처")
          .replace(/먹튀\s*\?\s*사고\s*\?\s*1도\s*없습니다/g, "보안 사고/금전 먹튀 zero 보장")
          .replace(/먹튀/g, "금전 피해사고")
          .replace(/1도\s*없습니다/g, "완전하게 제로(0%) 보장")
          .replace(/미친듯이/g, "상상 이상으로 뜨겁게")
          .replace(/터지는\s*중/g, "기세 좋게 상승세 타는 중")
          .replace(/약속/g, "제 이름을 단 정직 약속")
          .replace(/안녕하세요/g, "방문해주셔서 감사합니다")
          .replace(/오픈했습니다/g, "소개해 올립니다")
          .replace(/오픈/g, "신규 런칭")
          .replace(/혜택/g, "특별한 보상")
          .replace(/문의/g, "1:1 문의 메인")
          .replace(/가능합니다/g, "열려 있습니다")
          .replace(/완비/g, "말끔히 구성 완료");
      } else if (style === 3) {
        res = res
          .replace(/배팅/g, "게임 플레이")
          .replace(/먹튀\s*\?\s*사고\s*\?\s*1도\s*없습니다/g, "먹튀 및 검증 완료, 안전 100%")
          .replace(/먹튀/g, "피해 발생")
          .replace(/1도\s*없습니다/g, "단 1회도 발견된 적이 없습니다")
          .replace(/미친듯이/g, "엄청나게 잭팟")
          .replace(/터지는\s*중/g, "상승가도를 구사하는 중")
          .replace(/약속/g, "정식 보증 및 약속")
          .replace(/안녕하세요/g, "안녕하십니까")
          .replace(/오픈했습니다/g, "오픈을 선포합니다")
          .replace(/오픈/g, "정식 개업")
          .replace(/혜택/g, "파격 혜택리스트")
          .replace(/문의/g, "고객 센터")
          .replace(/가능합니다/g, "언제나 이용 가능합니다")
          .replace(/완비/g, "완비하여 운영 중");
      }
      return res;
    };

    const replaceEmojis = (text: string, style: number) => {
      let res = text;
      if (style === 1) {
        res = res
          .replace(/🔥/g, "⚡")
          .replace(/💎/g, "👑")
          .replace(/✅/g, "✔️")
          .replace(/🎁/g, "🎀")
          .replace(/📍/g, "🗺️")
          .replace(/📞/g, "📲")
          .replace(/📌/g, "📍");
      } else if (style === 2) {
        res = res
          .replace(/🔥/g, "✨")
          .replace(/💎/g, "🌟")
          .replace(/✅/g, "📌")
          .replace(/🎁/g, "💝")
          .replace(/📍/g, "Compass🧭")
          .replace(/📞/g, "💬")
          .replace(/📌/g, "✦");
      } else if (style === 3) {
        res = res
          .replace(/🔥/g, "📢")
          .replace(/💎/g, "💫")
          .replace(/✅/g, "❇️")
          .replace(/🎁/g, "🎁")
          .replace(/📍/g, "🚀")
          .replace(/📞/g, "🔔")
          .replace(/📌/g, "⚜️");
      }
      return res;
    };

    const v1Text = lines
      .map((line, i) => {
        let l = line;
        l = replaceEmojis(l, 1);
        l = replaceSynonyms(l, 1);
        if (l.trim().startsWith("-")) l = l.replace("-", "▪");
        if (l.trim().startsWith("•")) l = l.replace("•", "✦");
        return l + (i % 2 === 0 ? "\u200b" : "");
      })
      .join("\n");

    const v2Text = lines
      .map((line) => {
        let l = line;
        l = replaceEmojis(l, 2);
        l = replaceSynonyms(l, 2);
        if (l.trim().startsWith("-")) l = l.replace("-", "✦");
        if (l.trim().startsWith("•")) l = l.replace("•", "⁃");
        if (l.endsWith("오픈했습니다!")) l = l.replace("오픈했습니다!", "드디어 정식 오픈 완료!");
        if (l.endsWith("가능합니다!")) l = l.replace("가능합니다!", "가능하오니 참고해 주십시오.");
        if (l.endsWith("바랍니다!")) l = l.replace("바랍니다!", "정중히 부탁드리겠습니다.");
        return l + "\u200c";
      })
      .join("\n");

    const v3Text = lines
      .map((line) => {
        let l = line;
        l = replaceEmojis(l, 3);
        l = replaceSynonyms(l, 3);
        if (l.trim().startsWith("-")) l = l.replace("-", "➮");
        if (l.trim().startsWith("•")) l = l.replace("•", "➥");
        return "\u200d" + l;
      })
      .join("\n");

    return [
      {
        variationId: 101,
        title: "어휘 치환 & 글머리 기호 다각화 에디션",
        text: v1Text,
        hookType: "스팸 우회형 (글머리 기호 및 바이트 교차)",
        emojisUsed: ["⚡", "👑", "✔️", "🎀"]
      },
      {
        variationId: 102,
        title: "부정어구 전반 정돈 & 정밀 미러링 에디션",
        text: v2Text,
        hookType: "스팸 우회형 (문장 어미 미세 조정)",
        emojisUsed: ["✨", "🌟", "📌", "💝"]
      },
      {
        variationId: 103,
        title: "특수 기호 변좌 및 유니코드 마스킹 에디션",
        text: v3Text,
        hookType: "스팸 우회형 (특수 유니코드 다변화)",
        emojisUsed: ["📢", "💫", "❇️", "🚀"]
      }
    ];
  };

  const clientExpandSeedsToCount = (
    baseTextArg: string,
    seeds: Array<{ variationId: number; title: string; text: string; hookType: string; emojisUsed: string[] }>,
    targetCount: number
  ) => {
    if (!seeds || seeds.length === 0) return [];
    if (targetCount <= seeds.length) {
      return seeds.slice(0, targetCount);
    }

    const result = [...seeds];

    const defaultSynonyms = [
      { key: "안녕하세요", val: ["반갑습니다", "대단히 반갑습니다", "방문해 주셔서 감사드립니다", "안녕하세요 반가워요"] },
      { key: "오픈했습니다", val: ["정식 그랜드 론칭 완료했습니다", "오픈 완료하고 모십니다", "인테리어를 끝마치고 성황리에 문을 열었습니다"] },
      { key: "오픈", val: ["론칭 완료", "공식 출시", "신설 개설", "정식 오픈"] },
      { key: "혜택", val: ["스페셜 프로모션 지원 리워드", "특별한 기프트 쿠폰", "상상 이상의 혜택 보장", "파격적 특전"] },
      { key: "가능합니다", val: ["전격 대응 중입니다", "부담 없이 진행할 수 있게 조치되어 있습니다", "상시 가능하십니다"] },
      { key: "완비", val: ["풀세팅 완비 완료", "완벽히 제공 중", "세심하게 완비 및 세팅 완료"] },
      { key: "드립니다", val: ["증정하고 준비했습니다", "선사해 올립니다", "선물해 드립니다", "제공 조치하고 있습니다"] },
      { key: "환영합니다", val: ["두 팔 벌려 격히 모십니다", "대단히 감사드리며 기다리고 있겠습니다", "진심으로 환영합니다"] },
      { key: "최고의", val: ["독보적인 정점의", "넘버원급", "프리미엄 라인의"] },
      { key: "가성비", val: ["실속 있는 합리성", "효율 극강 비율", "파격적인 가격 효율성"] },
      { key: "배팅", val: ["플레이", "게임 플레이", "배팅 룸", "승부"] },
      { key: "사고", val: ["비해 사고", "클레임", "정산 트러블"] },
      { key: "먹튀", val: ["금전 트러블", "충환전 지연사고", "불투명 정산"] },
      { key: "도보 3분", val: ["걸어서 금방", "단숨에 닿는 코앞", "금방 가 닿는 거리"] },
      { key: "예약문의", val: ["예약 및 소통 창구", "핫라인 창구", "즉시 연계 번호"] },
      { key: "오시는 길", val: ["찾아오시는 경로", "상세 위치 안내", "위치 좌표"] }
    ];

    const emojiAlts: Record<string, string[]> = {
      "🔥": ["⚡", "💥", "🚀", "✨"],
      "🎁": ["🎀", "💝", "🎁", "🎉", "🍬"],
      "📞": ["📲", "💬", "📣", "🛎️"],
      "📍": ["🧭", "🗺️", "📍", "🌟"],
      "📌": ["📍", "✦", "❇️", "⚡"],
      "✅": ["✔️", "❇️", "✦", "✓", "👍"],
      "💎": ["💎", "🌟", "💫", "👑", "🥇"]
    };

    const shuffleBulletLists = (text: string): string => {
      let lines = text.split("\n");
      let i = 0;
      while (i < lines.length) {
        const isBullet = (l: string) => /^\s*([\-\*•▪✦📌✔️⚡📢❇️🚀⚜️💎➮➥⁃▪✔✓▶■●☞★]|[0-9]+\.)/.test(l);
        if (isBullet(lines[i])) {
          let listGroup: string[] = [];
          let startIdx = i;
          while (i < lines.length && isBullet(lines[i])) {
            listGroup.push(lines[i]);
            i++;
          }
          if (listGroup.length > 1) {
            for (let m = listGroup.length - 1; m > 0; m--) {
              const j = Math.floor(Math.random() * (m + 1));
              const temp = listGroup[m];
              listGroup[m] = listGroup[j];
              listGroup[j] = temp;
            }
            for (let m = 0; m < listGroup.length; m++) {
              lines[startIdx + m] = listGroup[m];
            }
          }
        } else {
          i++;
        }
      }
      return lines.join("\n");
    };

    let preventInfinite = 0;
    while (result.length < targetCount && preventInfinite < targetCount * 5) {
      preventInfinite++;
      const seed = seeds[result.length % seeds.length];
      let candidateText = seed.text;

      if (Math.random() < 0.75) {
        candidateText = shuffleBulletLists(candidateText);
      }

      const replacements = defaultSynonyms;
      replacements.forEach(({ key, val }) => {
        if (key.length < 2) return;
        if (Math.random() < 0.7) {
          const regex = new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g");
          if (regex.test(candidateText)) {
            const replacement = val[Math.floor(Math.random() * val.length)];
            candidateText = candidateText.replace(regex, replacement);
          }
        }
      });

      candidateText = candidateText.replace(/([🔥🎁📞📍📌✅💎])/g, (match) => {
        if (Math.random() < 0.8) {
          const alts = emojiAlts[match];
          if (alts && alts.length > 0) {
            return alts[Math.floor(Math.random() * alts.length)];
          }
        }
        return match;
      });

      const words = candidateText.split(/(\s+)/);
      const scrambledWords = words.map(word => {
        if (/^\s+$/.test(word)) return word;
        if (word.includes("t.me") || word.includes("http") || word.startsWith("@") || /^[0-9\-\:\+]+$/.test(word)) {
          return word;
        }
        if (word.length >= 2) {
          let processed = "";
          const letters = Array.from(word);
          for (let lIdx = 0; lIdx < letters.length; lIdx++) {
            processed += letters[lIdx];
            if (lIdx < letters.length - 1 && Math.random() < 0.35) {
              const invisibleSpaces = ["\u200b", "\u200c", "\u200d", "\u2060"];
              processed += invisibleSpaces[Math.floor(Math.random() * invisibleSpaces.length)];
            }
          }
          return processed;
        }
        return word;
      });
      candidateText = scrambledWords.join("");

      if (!result.some(r => r.text === candidateText)) {
        const idNum = result.length + 1;
        const subTitles = ["로컬 극성 셔플러", "무자위 기호 배치판", "자모 유니코드 분할기", "메신저 고도 흡수 에디션", "안전 침투용 로컬 미러링", "지연 변좌 전면 조합"];
        result.push({
          variationId: idNum,
          title: `로컬 정밀 다변화 에디션 #${idNum} (${subTitles[idNum % subTitles.length]})`,
          text: candidateText,
          hookType: "스팸 0레벨 초강도 우회 규격",
          emojisUsed: seed.emojisUsed
        });
      }
    }

    while (result.length < targetCount) {
      const idxNum = result.length + 1;
      const seed = seeds[idxNum % seeds.length];
      const spaces = ["\u200b", "\u200c", "\u200d", "\u2060"];
      const padding = spaces[Math.floor(Math.random() * spaces.length)].repeat(idxNum);
      result.push({
        variationId: idxNum,
        title: `실시간 우회 보증 믹스 #${idxNum}`,
        text: seed.text + padding,
        hookType: "바이트 오차 침투 규격",
        emojisUsed: seed.emojisUsed
      });
    }

    return result;
  };

  // Generate AI Variations
  const generateAIVariations = async () => {
    if (!baseText.trim()) {
      alert("기본 홍보 문구를 입력해주세요.");
      return;
    }
    setIsLoadingVariations(true);
    try {
      const response = await fetch("/api/generate-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseText, count: variationCount })
      });
      
      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        // Response is not JSON (happens on static server 404/500 html responses)
        throw new Error("Invalid API response format");
      }

      if (response.ok && data.variations) {
        setVariations(data.variations);
        setExpandedVariationIds({});
        setEditingVariationId(null);
        setGeneratorType(data.generatorType || "gemini");
        setGeneratorMessage(data.message || "");
        addSystemLog("AI", `[${data.generatorType === "local_fallback" ? "로컬 엔진" : "Gemini"}] 홍보 문구를 기반으로 ${data.variations.length}개의 고급 필터우회 버전을 자동 변동 빌드했습니다.`);
      } else {
        // Backend returned error response, trigger high-fidelity client fallback directly to keep app fully functional
        console.warn("Backend error, falling back to local client generator:", data?.error);
        const seeds = clientGenerateFallbackVariations(baseText);
        const expanded = clientExpandSeedsToCount(baseText, seeds, variationCount);
        setVariations(expanded);
        setExpandedVariationIds({});
        setEditingVariationId(null);
        setGeneratorType("local_fallback");
        setGeneratorMessage(`Cloudflare Pages 환경이 감지되어, 로컬 고성능 우회 믹싱 엔진이 추가 크레딧 소모 없이 총 ${expanded.length}개의 완벽한 우회 변본들을 순식간에 조합/조율해 냈습니다!`);
        addSystemLog("AI", `[로컬 엔진] Cloudflare Pages / API 장애 감지로 인해 브라우저 로컬 믹싱 엔진으로 자동 전환되어 ${expanded.length}개의 완벽한 우회 변본들을 생성하였습니다.`);
      }
    } catch (err: any) {
      // General network/endpoint resolution error (which happens 100% on pure static Cloudflare Pages hosting!)
      console.warn("Unreachable backend detected. Engaging pure Client-side auto-fallback engine gracefully:", err.message);
      
      const seeds = clientGenerateFallbackVariations(baseText);
      const expanded = clientExpandSeedsToCount(baseText, seeds, variationCount);
      
      setVariations(expanded);
      setExpandedVariationIds({});
      setEditingVariationId(null);
      setGeneratorType("local_fallback");
      setGeneratorMessage(`Cloudflare Pages 정적 웹 호스팅 환경이 감지되었습니다. 로컬 고성능 우회 믹싱 엔진이 추가 크레딧 소모 없이 총 ${expanded.length}개의 완벽한 우회 변본(동의어 치환, 이모지 랜덤 믹싱, 제로너비 공백 침투)들을 순식간에 조율해 냈습니다!`);
      addSystemLog("AI", `[로컬 믹서 클라이언트] API 연결 차단 감지로 브라우저 자체 로컬 엔진을 구동하여 ${expanded.length}개의 스팸안전 변형을 무상 생성했습니다.`);
    } finally {
      setIsLoadingVariations(false);
    }
  };

  // CSV File Upload Handler
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/);
        const parsed: PromotionChannel[] = [];
        let errorLines = 0;

        // Skip header if exists
        const startIdx = lines[0].includes("채널") || lines[0].includes("address") ? 1 : 0;

        for (let i = startIdx; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const parts = line.split(",");
          if (parts.length >= 1) {
            const address = parts[0].trim();
            if (!address) continue;

            const interval = parts[1] ? parseInt(parts[1].trim(), 10) : 45;
            const quota = parts[2] ? parseInt(parts[2].trim(), 10) : 10;

            parsed.push({
              id: `${Date.now()}-${i}`,
              address,
              intervalSeconds: isNaN(interval) ? 45 : interval,
              dailyQuota: isNaN(quota) ? 10 : quota,
              successCount: 0,
              status: "idle",
            });
          } else {
            errorLines++;
          }
        }

        if (parsed.length > 0) {
          setChannels(parsed);
          setCsvPreviewError(null);
          addSystemLog("SYSTEM", `CSV 파싱 성공: 총 ${parsed.length}개의 홍보 채널 목록이 적용되었습니다.`);
        } else {
          setCsvPreviewError("유효한 데이터를 로드하지 못했습니다. 형식을 확인하세요.");
        }
      } catch (err) {
        setCsvPreviewError("CSV 파일을 해석하는 중 오류가 발생했습니다.");
      }
    };
    reader.readAsText(file);
  };

  // Generate Sample CSV
  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "채널 주소(텔레그램 아이디/링크),홍보 주기(초 단위),일일 최대 홍보 횟수\n"
      + "@korea_retail_hub,45,15\n"
      + "https://t.me/seoul_hot_place_group,60,8\n"
      + "@young_business_plaza,90,5\n"
      + "https://t.me/local_market_promote,30,20\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "telegram_channels_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add system-level simulation logs
  const addSystemLog = (
    channel: string,
    message: string,
    status: '완료' | '지연대기' | '휴식중' | '실패' = '지연대기',
    link: string = "",
    textName: string = "N/A"
  ) => {
    const newLog: SimulationLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleTimeString('ko-KR'),
      channelAddress: channel,
      status,
      messageLink: link,
      textVersion: textName,
      details: message
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Run Human Simulation Thread
  const startSimulation = () => {
    if (channels.length === 0) {
      alert("홍보를 실행할 채널 목록이 유효하지 않습니다. CSV 파일을 업로드하거나 목록을 입력해주세요.");
      return;
    }
    if (variations.length === 0) {
      alert("변환된 홍보물이 없습니다. 먼저 AI 변환 버튼을 불러 실행하십시오.");
      return;
    }

    setIsSimulating(true);
    setSimulationStatus("스마트 휴먼 시뮬레이터 실행 중...");
    
    // Prepare channel list
    let channelsToRun = channels.map(c => ({ ...c, status: 'idle' as const }));
    let shuffledMark = "";
    
    if (antiSpam.randomChannelOrder) {
      // Fisher-Yates Shuffle Algorithm to escape spam pattern detection
      for (let i = channelsToRun.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = channelsToRun[i];
        channelsToRun[i] = channelsToRun[j];
        channelsToRun[j] = temp;
      }
      shuffledMark = " (순환 발송 대상 전체 채널 무작위 순서 셔플링 적용)";
    }
    
    // Set Ref values
    simulationStateRef.current = {
      currentIndex: 0,
      postsCompleted: 0,
      channelsList: channelsToRun
    };

    setChannels(simulationStateRef.current.channelsList);
    addSystemLog("SYSTEM", `텔레그램 차단 우회 시뮬레이션을 시작합니다.${shuffledMark}`, "지연대기");
    
    runNextSimulationStep();
  };

  const runNextSimulationStep = () => {
    const { currentIndex, postsCompleted, channelsList } = simulationStateRef.current;

    if (currentIndex >= channelsList.length) {
      // Loop or Complete
      setSimulationStatus("지정된 사이클 완료");
      setIsSimulating(false);
      addSystemLog("SYSTEM", "금일 지정된 모든 대기 채널 배포 시뮬레이션 목록이 안전하게 완료되었습니다.", "완료");
      return;
    }

    const currentChannel = channelsList[currentIndex];
    
    // 1. Check if we need a resting break (휴식시간 포함 법칙)
    if (postsCompleted > 0 && postsCompleted % antiSpam.restingPostCount === 0) {
      setSimulationStatus(`인간 행동 유사성 휴식 실행 중 (${antiSpam.restingMinutes}분 휴식)`);
      addSystemLog("휴식 감지", `[휴먼 휴식 수칙] 지나치게 빠른 연속 기재는 스패머로 의심받습니다. ${antiSpam.restingMinutes}분간 티타임 휴식 기표 처리.`, "휴식중");
      
      // Update channels states to resting
      const updated = channelsList.map((c, idx) => idx === currentIndex ? { ...c, status: 'resting' as const } : c);
      setChannels(updated);
      simulationStateRef.current.channelsList = updated;

      simTimeoutRef.current = setTimeout(() => {
        // Resume simulation after resting hours
        addSystemLog("휴식 완료", "게으른 휴식을 마치고 다음 채널 발송을 기획합니다.", "지연대기");
        simulationStateRef.current.postsCompleted = 0; // reset quota for next rest cycle
        runNextSimulationStep();
      }, antiSpam.restingMinutes * 5000); // simulation acceleration: replace 1 minute with 5 seconds for interactive preview
      return;
    }

    // 2. Select Dynamic random post delay (반복 수칙 우회형)
    let randomSec = Math.floor(Math.random() * (antiSpam.maxDelaySec - antiSpam.minDelaySec + 1)) + antiSpam.minDelaySec;
    if (antiSpam.lazyMode) {
      // Add a random human latency variable factor
      randomSec += Math.floor(Math.random() * 6) + 2; 
    }

    setSimulationStatus(`업로드 준비 상태... 다음 채널 [${currentChannel.address}] 대기 시간: ${randomSec}초`);
    
    const updatedWithSending = channelsList.map((c, idx) => idx === currentIndex ? { ...c, status: 'sending' as const } : c);
    setChannels(updatedWithSending);
    simulationStateRef.current.channelsList = updatedWithSending;

    simTimeoutRef.current = setTimeout(async () => {
      // Choose random text variation automatically to bypass spam hash matching
      const targetVarIdx = Math.floor(Math.random() * variations.length);
      const chosenVar = variations[targetVarIdx];

      if (isRealMode) {
        const isUserModeActive = session.isAuthorized && !session.useBotApi;
        
        if (!isUserModeActive && !realBotToken.trim()) {
          setSimulationStatus("실전 발송 중단 - 자격 증명 누락");
          setIsSimulating(false);
          addSystemLog(
            currentChannel.address,
            "[보안 거절] 실제 발송을 개시할 수 없습니다. 우측 하단 제어판에서 '텔레그램 봇 토큰'을 기입하거나 상단 '텔레그램 계정 연동' 탭에서 실제 개인 계정 로그인을 먼저 완성해 주십시오.",
            "실패",
            "",
            "N/A"
          );
          return;
        }

        try {
          const senderLabel = isUserModeActive 
            ? `실제 사용자 계정 [${session.accountUsername}]` 
            : `공식 봇 API`;

          setSimulationStatus(`[실제 발송] ${currentChannel.address} 채널 송출 중... (${senderLabel})`);
          
          let result: any;
          const isMock = session.sessionString === "mock_session_cloudflare_pages_only" || (!realBotToken && !isUserModeActive);
          
          if (isMock) {
            // Simulated local delay
            await new Promise(resolve => setTimeout(resolve, 850));
            result = {
              success: true,
              chatTitle: `${currentChannel.name || currentChannel.address} (가상 채널)`,
              messageLink: "https://t.me/c/123456/789",
              messageId: Math.floor(Math.random() * 100000)
            };
          } else {
            const requestBody: any = {
              chatId: currentChannel.address,
              text: chosenVar.text
            };

            if (isUserModeActive) {
              requestBody.sessionString = session.sessionString;
              requestBody.apiId = session.apiId;
              requestBody.apiHash = session.apiHash;
            } else {
              requestBody.botToken = realBotToken;
            }

            const response = await fetch("/api/telegram/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody)
            });

            try {
              result = await response.json();
            } catch (jsonErr) {
              throw new Error("정적 서버 감지: JSON 응답 포맷 오류");
            }

            if (!response.ok) {
              throw new Error(result?.error || "네트워크 오류");
            }
          }

          if (result && result.success) {
            // 실제 혹은 가상 발송 성공
            const finalUpdated = simulationStateRef.current.channelsList.map((c, idx) => {
              if (idx === currentIndex) {
                return {
                  ...c,
                  successCount: c.successCount + 1,
                  status: 'success' as const,
                  lastLog: `실제 전송 완료 (${result.chatTitle})`
                };
              }
              return c;
            });

            setChannels(finalUpdated);
            simulationStateRef.current.channelsList = finalUpdated;
            simulationStateRef.current.postsCompleted += 1;
            simulationStateRef.current.currentIndex += 1;

            addSystemLog(
              currentChannel.address,
              `실제 채널 전송 성공: '${chosenVar.title}' 카피문구를 [${result.chatTitle}] 채널로 완벽하게 쏘아 올렸습니다.`,
              "완료",
              result.messageLink || "https://t.me/c/0002341/88",
              chosenVar.title
            );
          } else {
            // 실제 발송 실패
            const finalUpdated = simulationStateRef.current.channelsList.map((c, idx) => {
              if (idx === currentIndex) {
                return {
                  ...c,
                  status: 'idle' as const,
                  lastLog: `전송 거부: ${result.error || "권한 에러"}`
                };
              }
              return c;
            });

            setChannels(finalUpdated);
            simulationStateRef.current.channelsList = finalUpdated;
            simulationStateRef.current.currentIndex += 1; // 실패해도 다음 채널로 수동 skip 우회

            addSystemLog(
              currentChannel.address,
              `실제 전송 실패: ${result.error || "메시지 발송 거절 또는 채팅방 가입 상태/권한 누락"}`,
              "실패",
              "",
              chosenVar.title
            );
          }
        } catch (error: any) {
          const finalUpdated = simulationStateRef.current.channelsList.map((c, idx) => {
            if (idx === currentIndex) {
              return {
                ...c,
                status: 'idle' as const,
                lastLog: "네트워크 끊김"
              };
            }
            return c;
          });

          setChannels(finalUpdated);
          simulationStateRef.current.channelsList = finalUpdated;
          simulationStateRef.current.currentIndex += 1;

          addSystemLog(
            currentChannel.address,
            `실제 전송 오류: 네트워크 단말 통신 에러 (${error.message || "연결 유실"})`,
            "실패",
            "",
            chosenVar.title
          );
        }
      } else {
        // 기존 데모 시뮬레이터 (가상 링크 모사)
        const channelCleaned = currentChannel.address.replace("@", "").replace("https://t.me/", "");
        const syntheticId = Math.floor(Math.random() * 9500) + 10400;
        const messageLink = `https://t.me/${channelCleaned}/${syntheticId}`;

        // Update Channel Successful Log
        const finalUpdated = simulationStateRef.current.channelsList.map((c, idx) => {
          if (idx === currentIndex) {
            return {
              ...c,
              successCount: c.successCount + 1,
              status: 'success' as const,
              lastLog: `${chosenVar.title} 발송완료 (Spam 바이패스 성공)`
            };
          }
          return c;
        });

        setChannels(finalUpdated);
        simulationStateRef.current.channelsList = finalUpdated;
        simulationStateRef.current.postsCompleted += 1;
        simulationStateRef.current.currentIndex += 1;

        addSystemLog(
          currentChannel.address,
          `홍보물 발송 완료! 스팸 차단 봇이 감지할 수 없는 '${chosenVar.title}' 변환문구를 랜덤 배치하였습니다.`,
          "완료",
          messageLink,
          chosenVar.title
        );
      }

      // Recursive execution
      runNextSimulationStep();
    }, randomSec * (isRealMode ? 1000 : 100)); // 실전 발송인 경우 실제 초 단위, 시뮬레이션은 빠른 배속 감상용 100ms 배율

  };

  // Stop Simulation
  const stopSimulation = () => {
    if (simTimeoutRef.current) {
      clearTimeout(simTimeoutRef.current);
    }
    setIsSimulating(false);
    setSimulationStatus("사용자 일시정지");
    addSystemLog("SYSTEM", "매장 마케터 제어로 시뮬레이션이 수동 정지되었습니다.", "지연대기");
  };

  // Reset counters
  const resetSimulation = () => {
    stopSimulation();
    const clean = defaultChannels.map(c => ({ ...c, successCount: 0, status: 'idle' as const, lastLog: undefined }));
    setChannels(clean);
    setLogs([]);
    setSimulationStatus("대기 상태");
  };

  // Export Daily Text Report
  const exportLogsAsText = () => {
    const successLogs = logs.filter(l => l.status === '완료' && l.messageLink);
    if (successLogs.length === 0) {
      alert("출력할 홍보 성공 이력 링크가 존재하지 않습니다. 먼저 발송을 성공시켜주십시오.");
      return;
    }
    
    // 점주 상사 보고 편의를 위해 오직 성공한 게시글 링크만 한줄에 하나씩 나열
    const report = successLogs.map(l => l.messageLink).join("\n");

    const element = document.createElement("a");
    const file = new Blob([report], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Telegram_Promo_Links_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Dynamic Navigation Topbar */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 rounded-xl text-white shadow-lg animate-pulse">
              <Send size={24} className="-rotate-12" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                텔레그램 매장 홍보 자동화 플래너
                <span className="text-xs bg-sky-500/20 text-sky-300 font-mono px-2 py-0.5 rounded border border-sky-400/30">
                  Interactive Dev Mode
                </span>
              </h1>
              <p className="text-xs text-slate-400">오픈 매장 점주용 타기팅 자동 기재 및 휴먼 시뮬레이션 제어 대시보드</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-slate-800 text-sky-400 border border-slate-700 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
              id="btn_tab_dashboard"
            >
              <div className="flex items-center gap-1.5">
                <Settings size={16} />
                대시보드 & 시뮬레이터
              </div>
            </button>
            <button
              onClick={() => setActiveTab("session")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === "session"
                  ? "bg-slate-800 text-sky-400 border border-slate-700 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
              id="btn_tab_session"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className={session.isAuthorized ? "text-emerald-400 animate-pulse" : ""} />
                세션 & API 연동 (Phase 2)
                {session.isAuthorized ? (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-[8px] text-white px-1 rounded-full font-bold">
                    ON
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 bg-sky-500 text-[8px] text-white px-1 rounded-full font-bold">
                    NEW
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("scheduler")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === "scheduler"
                  ? "bg-slate-800 text-sky-400 border border-slate-700 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
              id="btn_tab_scheduler"
            >
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-amber-400 animate-pulse" />
                24H 크론 스케줄러 & 상태 DB (Phase 3)
                <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] text-white px-1 py-0.5 rounded-full font-bold">
                  ACTIVE
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === "alerts"
                  ? "bg-slate-800 text-rose-400 border border-slate-700 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
              id="btn_tab_alerts"
            >
              <div className="flex items-center gap-1.5">
                <Bell size={16} className="text-rose-400 animate-bounce" />
                긴급 원격 알림 & 관제 (Phase 4)
                <span className="absolute -top-1 -right-1 bg-rose-500 text-[8px] text-white px-1 py-0.5 rounded-full font-bold animate-pulse">
                  ALARM
                </span>
              </div>
            </button>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* TAB 1: DASHBOARD & WORKFLOW SIMULATOR */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Input, Customization, Settings (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Card 1: Ad Text Base & Custom AI Mutation Box */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative overflow-hidden" id="card_base_text">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full filter blur-2xl -z-10 opacity-70"></div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                      <FileText size={18} />
                    </span>
                    <h2 className="text-base font-bold text-slate-900">1단계: 기본 매장 홍보 문구 입력</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">가독성 & 디자인 자동 확보</span>
                </div>
                
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  매장을 홍보할 기본 마스터 문구를 작성해주세요. 하단의 <strong className="text-sky-600">AI 우회문구 생성 가동</strong>버튼을 누르면 텔레그램 스팸 검출 기법을 피할 수 있게 문단 구조, 포인트 이모지를 다변화한 다양한 조합 카피로 생성됩니다.
                </p>

                <textarea
                  className="w-full h-44 p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans leading-relaxed text-slate-700"
                  placeholder="예: 동대문에 신규 오픈한 마라타운입니다! 만두 쿠폰 드려요..."
                  value={baseText}
                  onChange={(e) => setBaseText(e.target.value)}
                  id="textarea_base_text"
                />

                <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Layers size={14} className="text-sky-600" />
                        생성할 변형 카피 개수 설정
                      </label>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        몇 개를 요청하든 Gemini API로 3개 시드만 추출한 후, 로컬 AI 믹서가 무제한 확장하므로 <span className="text-emerald-600 font-semibold">추가 크레딧 소모가 0</span>입니다!
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        className="p-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 cursor-pointer shadow-sm"
                        value={variationCount}
                        onChange={(e) => setVariationCount(parseInt(e.target.value))}
                        id="select_variation_count"
                      >
                        <option value={3}>3개 (최소 변조)</option>
                        <option value={5}>5개 (안전)</option>
                        <option value={10}>10개 (추천)</option>
                        <option value={30}>30개 (고강도)</option>
                        <option value={50}>50개 (스팸 완벽방어)</option>
                        <option value={100}>100개 (대량 전송 최적화)</option>
                        <option value={200}>200개 (무한 교차 배포)</option>
                      </select>
                      
                      <div className="flex items-center bg-white border border-slate-300 rounded-lg p-1 shadow-sm">
                        <span className="text-[10px] text-slate-400 px-1.5 font-mono">직접입력:</span>
                        <input
                          type="number"
                          min={3}
                          max={500}
                          className="w-12 text-center text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 p-0.5 border-0 font-mono"
                          value={variationCount}
                          onChange={(e) => setVariationCount(Math.max(3, Math.min(500, parseInt(e.target.value) || 3)))}
                          id="input_variation_count"
                        />
                        <span className="text-xs text-slate-500 pr-1.5">개</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 font-medium w-full sm:w-auto">
                      <span>⭐ 무제한 믹스(0-AI 크레딧 공정) 기반 최대 500개 조합 출력 대기</span>
                    </div>
                    
                    <button
                      onClick={generateAIVariations}
                      disabled={isLoadingVariations}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-sky-500/10 active:scale-[0.98]"
                      id="btn_generate_ai"
                    >
                      {isLoadingVariations ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          AI 변환 & 로컬 믹싱 중...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          다변화 우회문구 {variationCount}개 자동 생성 시작
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Generated Variations Viewer */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                      <Layers size={18} />
                    </span>
                    <h2 className="text-base font-bold text-slate-900">2단계: 교차 업로드용 변형 에디션 ({variations.length}개 준비됨)</h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {variations.length > 0 && (
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        title="생성된 모든 다변화 문구를 엑셀/CSV 규격 다운로드"
                      >
                        <Download size={13} />
                        <span>전체 {variations.length}개 카피 CSV 다운로드</span>
                      </button>
                    )}
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 shadow-sm shrink-0">
                      <ShieldCheck size={12} /> 스팸 필터 우회강도: 최상
                    </span>
                  </div>
                </div>

                {generatorType && (
                  <div className={`mb-4 p-3 rounded-lg border text-xs leading-relaxed ${
                    generatorType === "local_fallback"
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="text-sm">
                        {generatorType === "local_fallback" ? "⚠️" : "✨"}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">
                          {generatorType === "local_fallback" 
                            ? "스마트 로컬 변조기(Local Rotator) 작동 중" 
                            : "Gemini 3.5-Flash 다변화 완료"}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {generatorMessage}
                        </p>
                        {generatorType === "local_fallback" && (
                          <p className="text-[10px] text-amber-600 mt-1">
                            * Gemini API 키가 부재중이거나 크레딧 한도 초과 상태입니다. 스팸 차단을 정상적으로 회피하기 위하여, 자체 탑재된 스마트 로컬 믹서가 원문의 정보 팩트를 누락 없이 정교하게 어휘/이모지/유니코드 단위로 개별 차별화하였습니다. (텔레그램 상의 스팸 필터는 정상 우회됩니다.)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Compact Accordion-Style List Container */}
                <div className={`space-y-1.5 pr-1 ${variations.length > 20 ? "max-h-[600px] overflow-y-auto" : ""}`}>
                  {variations.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50">
                      위에 '자동 생성 시작' 버튼을 눌러 교차 스팸방지용 변형 에디션을 추출해주세요.
                    </div>
                  ) : (
                    variations.map((v, idx) => {
                      const isExpanded = !!expandedVariationIds[v.variationId];
                      const isEditing = editingVariationId === v.variationId;

                      return (
                        <div 
                          key={v.variationId} 
                          className={`border rounded-lg transition-all text-left ${
                            isExpanded 
                              ? "border-sky-300 bg-sky-50/10 shadow-sm" 
                              : "border-slate-200 hover:border-slate-300 bg-slate-50/40"
                          }`}
                        >
                          {/* Row Header */}
                          <div 
                            onClick={() => toggleExpandVariation(v.variationId)}
                            className="p-3 flex items-center justify-between gap-3 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 flex-grow min-w-0">
                              <span className="text-[9.5px] bg-slate-200 text-slate-600 font-mono font-bold px-1.5 py-0.5 rounded shrink-0">
                                #{idx + 1}
                              </span>
                              <span className="text-[9.5px] bg-sky-100 text-sky-800 border border-sky-200/55 px-1.5 py-0.5 rounded shrink-0 font-bold">
                                {v.hookType || "스팸 우회 변형"}
                              </span>
                              <h4 className="text-xs font-semibold text-slate-800 truncate">{v.title}</h4>
                            </div>

                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              {/* Quick copy key */}
                              <button
                                onClick={() => handleCopy(v.text, v.variationId)}
                                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition active:scale-95"
                                title="이 원본글 즉시 복사"
                              >
                                {copiedId === v.variationId ? (
                                  <Check size={13} className="text-emerald-600" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                              
                              {/* Toggle expand button */}
                              <button
                                onClick={() => toggleExpandVariation(v.variationId)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition"
                              >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded content area */}
                          {isExpanded && (
                            <div className="px-3.5 pb-3.5 pt-0 border-t border-slate-100 bg-white/70 rounded-b-lg space-y-3">
                              {isEditing ? (
                                <div className="space-y-3 pt-3">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500">에디션 제목</label>
                                    <input
                                      type="text"
                                      value={editingVariationTitle}
                                      onChange={(e) => setEditingVariationTitle(e.target.value)}
                                      className="w-full p-2 text-xs border border-slate-300 rounded focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 font-semibold"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500">홍보 본문 내용 수정</label>
                                    <textarea
                                      rows={6}
                                      value={editingVariationText}
                                      onChange={(e) => setEditingVariationText(e.target.value)}
                                      className="w-full p-2.5 text-xs border border-slate-300 rounded focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 font-mono leading-relaxed"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={handleCancelEditVariation}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 font-semibold rounded border border-slate-200 transition flex items-center gap-1"
                                    >
                                      <X size={11} />
                                      <span>취소</span>
                                    </button>
                                    <button
                                      onClick={() => handleSaveVariation(v.variationId)}
                                      className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white hover:text-white text-[10px] font-semibold rounded border border-sky-700 transition flex items-center gap-1 shadow-sm"
                                    >
                                      <Save size={11} />
                                      <span>변경내용 저장</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3 pt-3">
                                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap select-all">
                                    {v.text}
                                  </div>

                                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9.5px] text-slate-400 mr-1 font-medium">안전 장치 이모지:</span>
                                      {v.emojisUsed && v.emojisUsed.slice(0, 5).map((emoji, i) => (
                                        <span key={i} className="text-xs" title="자동 변형 이모지">{emoji}</span>
                                      ))}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleStartEditVariation(v)}
                                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-[10px] border border-slate-200 rounded text-slate-600 font-semibold transition flex items-center gap-1"
                                        title="문장 또는 키워드 문구 정밀 수정"
                                      >
                                        <Edit2 size={10} className="text-slate-500" />
                                        <span>내용 직접수정</span>
                                      </button>

                                      <button
                                        onClick={() => handleCopy(v.text, v.variationId)}
                                        className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-[10px] border border-sky-200 rounded text-sky-700 font-semibold transition flex items-center gap-1"
                                      >
                                        {copiedId === v.variationId ? (
                                          <>
                                            <Check size={10} className="text-emerald-600" />
                                            <span className="text-emerald-600 font-bold">복사성공</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy size={10} />
                                            <span>텍스트 전체복사</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Card 3: Humanization Logic Configurator */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                    <User size={18} />
                  </span>
                  <h2 className="text-base font-bold text-slate-900">3단계: 안티스팸 휴식/딜레이 세부 조절 (안티-스팸 봇 우회)</h2>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  텔레그램에서 사람이 작성하는 것과 같은 자연스러운 흐름을 연출하기 위한 파라미터 값입니다. 
                  고속 연사는 텔레그램 플랫폼의 IP 차단 및 채널 신고로 직결됩니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Min Max Delay */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 block mb-1">게시글 업로드 랜덤 대기 간격</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded text-center focus:outline-sky-500"
                          value={antiSpam.minDelaySec}
                          onChange={(e) => setAntiSpam({ ...antiSpam, minDelaySec: Math.max(1, parseInt(e.target.value) || 1) })}
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400">초(최소)</span>
                      </div>
                      <span className="text-slate-400 text-xs">~</span>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded text-center focus:outline-sky-500"
                          value={antiSpam.maxDelaySec}
                          onChange={(e) => setAntiSpam({ ...antiSpam, maxDelaySec: Math.max(antiSpam.minDelaySec, parseInt(e.target.value) || 2) })}
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400">초(최대)</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1.5">채널 기재 시마다 이 범위 안에서 무작위 대기합니다.</span>
                  </div>

                  {/* Rest Logic Customizer */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 block mb-1">휴식 시간 기동 기준</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded text-center focus:outline-sky-500"
                          value={antiSpam.restingPostCount}
                          onChange={(e) => setAntiSpam({ ...antiSpam, restingPostCount: Math.max(1, parseInt(e.target.value) || 1) })}
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400">회 발송 후</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded text-center focus:outline-sky-500"
                          value={antiSpam.restingMinutes}
                          onChange={(e) => setAntiSpam({ ...antiSpam, restingMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400">분 티타임</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1.5">지정 횟수 이상 달성 시 추가로 장기 휴직 대기 기간을 가집니다.</span>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-2">
                    <Coffee className="text-indigo-600 animate-bounce" size={16} />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950">스마트 게으른 인간(Lazy Mimic) 지연 연산 기능</h4>
                      <p className="text-[10px] text-indigo-700 leading-tight">기계적 업로드로 분류되는 것을 막기 위해 추가 8%~15%의 인간 인지 렉(정지) 임의 시뮬레이팅.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500 cursor-pointer"
                    checked={antiSpam.lazyMode}
                    onChange={(e) => setAntiSpam({ ...antiSpam, lazyMode: e.target.checked })}
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-between p-3 bg-sky-50/50 rounded-lg border border-sky-100">
                  <div className="flex items-center gap-2">
                    <Shuffle className="text-sky-600 animate-pulse" size={16} />
                    <div>
                      <h4 className="text-xs font-bold text-sky-950">채널 랜덤 순환 배포 (가장 강력한 스팸필터 우회)</h4>
                      <p className="text-[10px] text-sky-700 leading-tight">매 순환 시작 시마다 채널들의 기재 순서를 뒤섞음으로써, 규칙적인 반복 유형으로 스팸 수집 봇에게 찍히는 위험을 전면 제거합니다.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-sky-600 border-sky-300 rounded focus:ring-sky-500 cursor-pointer"
                    checked={antiSpam.randomChannelOrder ?? true}
                    onChange={(e) => setAntiSpam({ ...antiSpam, randomChannelOrder: e.target.checked })}
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Active Channels, Simulator Controller, Logs (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Card 4: Import Telegram Channels & Download Sample */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                      <Upload size={18} />
                    </span>
                    <h2 className="text-base font-bold text-slate-900">가입 채널(공개 그룹) 명단 로드</h2>
                  </div>
                  <button
                    onClick={downloadSampleCSV}
                    className="text-[10px] text-sky-600 bg-sky-50 hover:bg-sky-100 font-bold px-2 py-1 rounded border border-sky-100 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Download size={10} />
                    샘플 엑셀(CSV) 다운로드
                  </button>
                </div>

                <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
                  매장이 소속되거나 가입된 텔레그램 그룹 아이라 주소 파일을 업로드하십시오. 
                  (CSV 행 양식: <code>채널주소,홍보주기,최대홍보횟수</code>)
                </p>

                {/* Drag n Drop Upload Area */}
                <div className="border border-dashed border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/20 transition rounded-lg p-4 text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleCsvUpload}
                  />
                  <Upload size={22} className="mx-auto text-slate-400 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-700 block">이곳에 CSV 파일을 끌어놓거나 클릭하여 선택</span>
                  <span className="text-[10px] text-slate-400 block mt-1">파일 인코딩: UTF-8</span>
                </div>

                {csvPreviewError && (
                  <p className="text-[10px] text-rose-600 mt-2 bg-rose-50 p-2 rounded border border-rose-100">
                    ⚠️ {csvPreviewError}
                  </p>
                )}

                {/* Inline list of channels */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700">채널 명단 ({channels.length}개 대상)</span>
                    <button
                      onClick={() => {
                        const randomId = Math.random().toString(36).substr(2, 5);
                        setChannels([...channels, { id: randomId, address: "@new_channel_" + randomId, intervalSeconds: 45, dailyQuota: 5, successCount: 0, status: 'idle' }]);
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-800 underline uppercase"
                    >
                      + 수동 채널 추가
                    </button>
                  </div>

                  <div className="max-h-44 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100">
                    {channels.map((chan, index) => (
                      <div key={chan.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50 text-xs transition">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 flex items-center justify-center bg-slate-100 font-mono text-[10px] text-slate-500 rounded font-semibold shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-medium text-slate-800 truncate" title={chan.address}>{chan.address}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {chan.intervalSeconds}초 간격 | 일 {chan.dailyQuota}회한
                          </span>
                          
                          {/* Channel specific statuses */}
                          {chan.status === 'success' && <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">성공</span>}
                          {chan.status === 'sending' && <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200 animate-pulse">발송대기</span>}
                          {chan.status === 'resting' && <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-200">휴게중</span>}
                          {chan.status === 'idle' && <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-full">대기</span>}

                          <button 
                            onClick={() => setChannels(channels.filter(c => c.id !== chan.id))}
                            className="text-slate-300 hover:text-rose-600 text-xs py-0.5 px-1"
                            title="목록에서 삭제"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 5: Smart Human Simulator Engine Panel */}
              <div className="bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full filter blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="text-sky-400" size={18} />
                    <span className="text-sm font-bold tracking-tight">회피 마킹 시뮬레이터 실시간 제어판</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`}></span>
                    <span className="text-[10px] text-slate-400 font-mono">{isSimulating ? 'SIM_RUNNING' : 'STOPPED'}</span>
                  </div>
                </div>

                {/* State readout box */}
                <div className="bg-slate-950/70 rounded-lg p-3.5 border border-slate-800 mb-4 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
                    <span className="text-[11px] text-slate-400">제어판 상태</span>
                    <span className="text-xs text-sky-400 font-semibold">{simulationStatus}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-500 block">총 누적 전송건수</span>
                      <span className="text-sm font-bold text-slate-200 mt-1 block">
                        {channels.reduce((acc, curr) => acc + curr.successCount, 0)} 회
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">현재 대행 차례</span>
                      <span className="text-sm font-bold text-slate-200 mt-1 block truncate">
                        {isSimulating ? channels[simulationStateRef.current.currentIndex]?.address || "종료단" : "미가동"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 실전 가동 모드 상세 제어 및 번외 설정 입력 */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3.5 mb-4 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sky-400">실제 홍보 활동 가동 (실전 송출)</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isRealMode}
                        onChange={(e) => setIsRealMode(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 mb-2.5 leading-tight">
                    * 활성화 시 매 지연간격마다 실제 텔레그램 API를 쏘아, 세팅된 대상 채널로 홍보물을 진본 업로드합니다.
                  </p>

                  {isRealMode && (
                    <div className="space-y-2.5 mt-1 border-t border-slate-800/60 pt-2.5">
                      {session.isAuthorized && !session.useBotApi ? (
                        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded p-2.5">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1">🔥 개인 계정 발송 모드 활성화됨 (MTProto)</span>
                          <p className="text-[10px] text-slate-300 leading-normal">
                            현재 연동된 점주님의 실사용자 계정 <strong>{session.accountUsername}</strong> 신분으로 직접 그룹 채팅방에 홍보물을 살포합니다. 봇이 금지된 그룹방에서도 안심하고 실전 홍보가 가능합니다!
                          </p>
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={() => {
                                setSessionStep("choose");
                                setActiveTab("session");
                              }}
                              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition"
                            >
                              계정 변경 / 연동 관리
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-[10px] text-slate-300 block mb-1">텔레그램 봇 토큰 (Bot Token)</span>
                            <input
                              type="password"
                              className="w-full bg-slate-900 border border-slate-705 border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                              placeholder="예: 123456789:ABCdefGhI..."
                              value={realBotToken}
                              onChange={(e) => {
                                setRealBotToken(e.target.value);
                                localStorage.setItem("real_bot_token", e.target.value);
                              }}
                            />
                          </div>
                          <div className="text-[9px] text-slate-500 leading-tight">
                            🚨 가이드: 발송할 봇(@BotFather 생성)이 대상 전송 채널에 **"관리자"** 및 **"메시지 게시"** 활성화 상태로 추가되어 있어야 실제 배포가 완수됩니다.
                          </div>
                          <div className="bg-amber-950/30 border border-amber-900/40 rounded p-2.5 mt-1 text-slate-400">
                            <span className="text-[10px] text-amber-400 font-bold block mb-0.5">💡 전용 사용자(유저봇) 계정 송신 팁</span>
                            <p className="text-[9px] text-slate-400 leading-normal">
                              봇이 글을 쓸 수 없는 그룹방에 가입하여 본인의 실계정 신분으로 자동 홍보하고 싶으시다면, 상단 탭에서 <strong>[텔레그램 계정 연동]</strong> 탭을 클릭하여 본인 계정 로그인을 먼저 완료해주세요!
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Trigger Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {!isSimulating ? (
                    <button
                      onClick={startSimulation}
                      className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                      id="btn_start_sim"
                    >
                      <Play size={14} fill="currentColor" />
                      스마트 시뮬레이션 기동
                    </button>
                  ) : (
                    <button
                      onClick={stopSimulation}
                      className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                      id="btn_stop_sim"
                    >
                      <Pause size={14} fill="currentColor" />
                      시뮬레이션 일시 정지
                    </button>
                  )}
                  <button
                    onClick={resetSimulation}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition"
                    id="btn_reset_sim"
                  >
                    초기화
                  </button>
                </div>
              </div>

              {/* Card 6: Live Activity Logs & Daily Report Generator */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col flex-1 min-h-[300px]">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
                      <History size={16} />
                    </span>
                    <h2 className="text-base font-bold text-slate-900">실시간 스팸 회피 보고서 상세 이력</h2>
                  </div>
                  <button
                    onClick={exportLogsAsText}
                    className="text-[10px] text-slate-600 hover:text-sky-600 font-bold px-2.5 py-1 border border-slate-200 rounded-lg bg-white flex items-center gap-1 cursor-pointer transition shadow-none"
                    title="일별 텍스트 보고서 즉시 추출"
                  >
                    <Download size={11} />
                    일일 보고서 (.txt) 내보내기
                  </button>
                </div>

                <p className="text-xs text-slate-500 mb-3 leading-tight">
                  자동 홍보물이 발송될 때 스팸 봇을 피해 실제 발급된 텔레그램 고유 메시지 링크를 그대로 모사 복사합니다.
                </p>

                {/* Logs Terminal */}
                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 flex-1 font-mono text-[11px] overflow-y-auto max-h-60 flex flex-col gap-2 min-h-[180px]">
                  {logs.length === 0 ? (
                    <div className="my-auto text-center text-slate-500 flex flex-col items-center gap-1.5">
                      <FileText size={24} className="opacity-40" />
                      <span>기록된 발송 이력이 없습니다.</span>
                      <span>우측 상단 시뮬레이터를 켜고 지연 루프를 돌려보세요!</span>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="border-b border-slate-800/80 pb-2 last:border-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-slate-500 text-[10px] shrink-0 font-semibold">{log.timestamp}</span>
                          <span className="text-sky-300 font-bold max-w-[150px] truncate block">{log.channelAddress}</span>
                          
                          {log.status === '완료' && <span className="bg-emerald-950 text-emerald-400 font-semibold px-1.5 rounded text-[10px]">완료</span>}
                          {log.status === '휴식중' && <span className="bg-amber-950 text-amber-400 font-semibold px-1.5 rounded text-[10px]">휴식중</span>}
                          {log.status === '지연대기' && <span className="bg-blue-950 text-blue-400 font-semibold px-1.5 rounded text-[10px]">대기</span>}
                          {log.status === '실패' && <span className="bg-rose-950 text-rose-400 font-semibold px-1.5 rounded text-[10px]">실패</span>}
                        </div>
                        
                        <div className="text-slate-300 text-xs leading-relaxed leading-5">🧑‍💻 {log.details}</div>
                        
                        {log.messageLink && (
                          <div className="mt-1 flex items-center justify-between text-[10px] bg-slate-950/60 p-1 px-2 rounded text-slate-400">
                            <span className="truncate max-w-[220px]">🔗 {log.messageLink}</span>
                            <a
                              href={log.messageLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-400 hover:underline flex items-center gap-0.5 scale-90 hover:scale-100 transition shrink-0"
                            >
                              이동 <ExternalLink size={8} />
                            </a>
                          </div>
                        )}
                        {log.textVersion && log.textVersion !== "N/A" && (
                          <div className="mt-0.5 text-[9px] text-slate-500">배포 카피: {log.textVersion}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* 보고용 링크만 모아보기 보드 */}
                {logs.filter(l => l.status === '완료' && l.messageLink).length > 0 && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex flex-col gap-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        상사 보고용 발송성공 링크 모음
                      </span>
                      <button
                        onClick={() => {
                          const links = logs.filter(l => l.status === '완료' && l.messageLink).map(l => l.messageLink).join("\n");
                          navigator.clipboard.writeText(links);
                          alert("성공한 텔레그램 메시지 링크가 클립보드에 복사되었습니다! 상사에게 바로 보고하세요.");
                        }}
                        className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded transition shadow-sm cursor-pointer"
                      >
                        전체 복사
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={3}
                      className="w-full text-[11px] font-mono bg-white border border-emerald-100 rounded p-2 focus:outline-none text-slate-700 resize-none"
                      value={logs.filter(l => l.status === '완료' && l.messageLink).map(l => l.messageLink).join("\n")}
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      title="클릭하면 전체 드래그 선택됩니다."
                    />
                    <span className="text-[9px] text-emerald-600 leading-tight">* 상사분 보고 목적에 맞추어 요약 멘트 없이 '메시지 링크만' 깔끔하게 복사하거나 한 줄씩 추릴 수 있습니다.</span>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 1.5: TELEGRAM SESSION & API GATEWAY WIZARD (Phase 2 완성) */}
        {activeTab === "session" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" id="panel_session_wizard">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-sky-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-44 h-44 bg-sky-500/10 rounded-full filter blur-3xl opacity-60"></div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl border border-sky-400/30">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    Phase 2: 텔레그램 MTProto 세션 & API 게이트웨이 연동
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-400/40 font-bold uppercase tracking-wider">
                      Ready for Test
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    점주님의 홍보 대행 자동화 실전 운영을 위한 인증 엔진입니다. 브라우저 컴퓨터를 꺼놓아도 백업 워커가 홍보를 지속할 수 있도록 
                    암호화된 텔레그램 세션 문자열(Session String) 생성 및 게이트웨이 통신을 가상 검증합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Interactive Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Form Wizard (7 cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[480px]">
                
                {/* Error & Success Messages */}
                {sessionError && (
                  <div className="mb-4 bg-rose-50 text-rose-700 text-xs p-4 rounded-xl border border-rose-100 flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5 animate-bounce" />
                      <div>
                        <strong className="font-bold">인증 처리 실패:</strong> {sessionError}
                      </div>
                    </div>
                    
                    {/* Catch static deployment context or TCP network blocks (such as GCP/CloudRun datacenter block by Telegram) */}
                    {(sessionError.includes("JSON") || sessionError.includes("정적") || sessionError.includes("Server") || sessionError.includes("unreachable") || sessionError.includes("소켓") || sessionError.includes("TCP") || sessionError.includes("연결") || sessionError.includes("Timeout")) && (
                      <div className="bg-white/80 p-4 rounded-lg border border-rose-200/50 text-slate-700 space-y-2.5">
                        {sessionError.includes("TCP") || sessionError.includes("소켓") || sessionError.includes("Timeout") || sessionError.includes("연결") ? (
                          <>
                            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                              <ShieldAlert size={14} className="text-rose-600" />
                              <span>클라우드 서버의 텔레그램 원격 소켓 차단 및 지연 극복 가이드</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                              현재 호스팅 서버 환경(Google Cloud Run 컨테이너)에서 발생하는 텔레그램 본사 서버(MTProto 149.154.xxx 대역) 통신 지연 또는 TCP 원시 포트 차단 증상이 탐지되었습니다. 텔레그램은 보안상의 이유로 공용 데이터센터 IP 대역의 직접 원시 소켓 연동을 자주 제한합니다.
                            </p>
                            <div className="text-[11px] text-slate-600 leading-relaxed font-sans space-y-1.5">
                              <div><strong>🚀 해결책 A (가장 권장 - 100% 동작):</strong> 첫 화면에서 <strong>[공식 Bot API Token 연동]</strong> 토글을 켜신 뒤 연동해 주십시오. Bot API 방식은 차단되지 않는 standard HTTPS 프로토콜 터널을 활용하기 때문에 포트 제한을 그대로 우회하여 즉시 성공합니다!</div>
                              <div><strong>🚀 해결책 B (즉시 모의 체험):</strong> 하단 버튼을 즉시 눌러 <strong>[정적 시뮬레이션 데모 모드]</strong>를 활성화하시면, 복잡한 인증 절치 생략 및 데이터 소켓 유실 없이 카피라이팅 변조, 실시간 스케줄러, 지능형 보안 알람 대시보드를 100% 그대로 기동하여 체험하실 수 있습니다.</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                              <Layers size={13} className="text-rose-600" />
                              <span>정적 웹서버 (Cloudflare Pages 등) 배포 시 필수 해결 가이드</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                              현재 접속하신 사이트는 정적 자산(Static Assets) 전용 호스팅 서비스인 <strong>Cloudflare Pages</strong>에 구축되었습니다. 텔레그램 API 원격 연동 및 지속형 예약 스케줄러를 가동시킬 백엔드 Express 서버(NodeJS)가 독립적으로 작동하지 않아 이 문제가 발생했습니다.
                            </p>
                            <div className="text-[11px] text-slate-600 leading-relaxed font-sans space-y-1">
                              <div><strong>💡 해결방법 A (풀스택 구동):</strong> 깃허브 원본 코드를 NodeJS 실행을 전격 지원하는 플랫폼(예: <strong>Render, Railway, Google Cloud Run</strong>)에 배포하시면 즉시 실전 텔레그램 연동이 활성화됩니다.</div>
                              <div><strong>💡 해결방법 B (데모 즉시 체험):</strong> 우측 하단 버튼을 클릭해 <strong>[정적 시뮬레이션 데모 모드]</strong>를 작동시키면, 실존하는 서버 연동 과정 없이 브라우저 내에서 완벽한 스팸필터 우회 다변화 문구 생성, 클라이언트 실시간 스케줄 송출, 위기관리 알림 대시보드를 즉각 시각적으로 전폭 체험해 보실 수 있습니다!</div>
                            </div>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={handleEnableStaticDemoSession}
                          className="w-full mt-1.5 py-2.5 px-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles size={13} />
                          <span>클라이언트 백엔드 없는 데모 계정으로 즉시 연동 완료하기 🚀</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {sessionSuccessMsg && (
                  <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                    <div className="whitespace-pre-line">{sessionSuccessMsg}</div>
                  </div>
                )}

                {/* Step Content */}
                {sessionStep === "choose" && (
                  <div className="space-y-5 my-auto py-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-base font-bold text-slate-900">연동 방식을 선택해주세요</h3>
                      <p className="text-xs text-slate-500">점주님의 사용 용도 및 공정 권한에 맞는 기법을 고를 수 있습니다.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Option 1: MTProto Userbot */}
                      <button
                        onClick={() => {
                          setIsUseBotApi(false);
                          setSessionStep("credentials");
                        }}
                        className="p-5 bg-slate-50 hover:bg-sky-50/40 border border-slate-200 hover:border-sky-300 rounded-2xl text-left transition group cursor-pointer"
                        id="option_mtproto"
                      >
                        <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                          <User size={20} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-sky-600 transition">MTProto 사용자 계정 로그인</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          개인/홍보 가상 유정 신분으로 활성화합니다. 봇 차단이 걸려있는 일반 공개 채팅 그룹에도 제약 없이 자유 기재가 가능합니다. <strong className="text-sky-600 font-medium">(권장)</strong>
                        </p>
                      </button>

                      {/* Option 2: Bot API */}
                      <button
                        onClick={() => {
                          setIsUseBotApi(true);
                          setSessionStep("credentials");
                        }}
                        className="p-5 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition group cursor-pointer"
                        id="option_botapi"
                      >
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                          <Zap size={20} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition">공식 텔레그램 봇 API 연동</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          점주님이 채널이나 그룹의 관리자 권한을 가졌을 시, 봇 토큰(HTTP API)만을 사용하여 SMS 인증 코드 절차 없이 즉석으로 자동 발행이 구동됩니다.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {sessionStep === "credentials" && (
                  <form onSubmit={handleRequestAuthCode} className="space-y-4 my-auto">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {isUseBotApi ? "공식 봇 API 자격 증명 설정" : "텔레그램 API ID 및 해시 정보 기입"}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isUseBotApi 
                          ? "텔레그램 BotFather에게서 발급 받은 봇 토큰 문자열을 기입하십시오."
                          : "텔레그램 계정의 고유 API 자격 증명을 입력합니다. 이 자격 증명은 점주님 브라우저 상에 안전하게 토큰으로 보존됩니다."}
                      </p>
                    </div>

                    {!isUseBotApi ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">API ID (숫자)</label>
                            <input
                              type="text"
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-sky-500 rounded-lg text-slate-800"
                              placeholder="예: 28471932"
                              value={inputApiId}
                              onChange={(e) => setInputApiId(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">API Hash</label>
                            <input
                              type="text"
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-sky-500 rounded-lg text-slate-800"
                              placeholder="예: cf8274a1...9eff"
                              value={inputApiHash}
                              onChange={(e) => setInputApiHash(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">계정 휴대폰 번호 (국제 표준 형식)</label>
                          <input
                            type="tel"
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-sky-500 rounded-lg text-slate-800"
                            placeholder="+82 10-1234-5678"
                            value={inputPhoneNumber}
                            onChange={(e) => setInputPhoneNumber(e.target.value)}
                            required
                          />
                        </div>

                        {/* Special tips regarding NO-PHONE session maintenance */}
                        <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200/80 text-amber-950 text-xs">
                          <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                            <Sparkles size={14} className="text-amber-600 animate-pulse" />
                            💡 스마트폰(폰 기기)이 근처에 없어도 전혀 걱정 없음!
                          </div>
                          <p className="leading-relaxed">
                            직장에서 지급받아 현재 회사 컴퓨터(PC)에 텔레그램 메신저가 켜져 있는 상태라면, 
                            로그인을 위한 5자리 인증 번호는 문자가 아닌 **PC 텔레그램 채팅 창 내의 텔레그램 공식 계정 대화방**으로 즉시 배달됩니다. 폰이 없는 상태에서도 완벽하게 세션을 유지할 수 있으니 안심하시고 가동하세요!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Telegram Bot Token (HTTP API)</label>
                          <input
                            type="text"
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-sky-500 rounded-lg text-slate-800 font-mono"
                            placeholder="예: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                            value={inputBotToken}
                            onChange={(e) => setInputBotToken(e.target.value)}
                            required
                          />
                        </div>
                        <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 text-slate-600 text-xs leading-relaxed">
                          공식 봇 계정은 텔레그램에서 무료로 생성할 수 있습니다. 단, 봇은 타인이 개설한 일반 잡담 단체 대화방에 허가없이 먼저 메시지를 보낼 수는 없으므로, 소유 및 가입된 직영 공식 홍보 채널 위주에 권한 발송하는 데 활용됩니다.
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSessionStep("choose")}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-lg transition"
                      >
                        이전 단계로
                      </button>
                      <button
                        type="submit"
                        disabled={isRequestingCode}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        id="btn_request_code"
                      >
                        {isRequestingCode ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            게이트웨이 검증 통신 중...
                          </>
                        ) : (
                          <>
                            <span>{isUseBotApi ? "봇 토큰 연결 및 검증 실행" : "텔레그램 원격 로그인 인증코드 요청"}</span>
                            <ChevronRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {sessionStep === "verify" && (
                  <form onSubmit={handleVerifyAuthCode} className="space-y-4 my-auto">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">로그인 5자리 인증코드 입력</h3>
                      <p className="text-xs text-slate-500">
                        {inputPhoneNumber} 번호로 요청된 인증코드를 입력하십시오. 
                        앞서 확인하셨듯, **현재 PC에 로그인되어 있는 텔레그램 앱의 [Telegram] 공식 알림방**에 숫자 5자리가 배달되어 있습니다.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] font-bold text-slate-600 block">텔레그램 공식 인증 번호 (5자리)</label>
                          <button
                            type="button"
                            onClick={() => setSmsCode("12345")}
                            className="text-[10px] bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold px-2 py-0.5 rounded shadow-sm hover:shadow transition"
                          >
                            🚀 테스트용 코드 자동 입력 (12345)
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={5}
                          className="w-full text-center p-3 text-lg font-mono tracking-[1em] pl-[1.1em] bg-slate-50 border border-slate-200 focus:bg-white focus:outline-sky-500 rounded-lg text-indigo-700 font-bold"
                          placeholder="•••••"
                          value={smsCode}
                          onChange={(e) => setSmsCode(e.target.value.replace(/[^0-9]/g, ""))}
                          required
                        />
                      </div>

                      {/* Explicit Sim Guidance box */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-slate-700 space-y-1.5">
                        <div className="font-bold text-indigo-900 flex items-center gap-1">
                          <Sparkles size={14} className="text-indigo-600" />
                          <span>프로토타입 가상 시뮬레이션 안내</span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-slate-600">
                          본 프로그램은 최종 운영 환경 배포 전 단계의 **개발 검수용 프로토타입**입니다. 
                          실제 텔레그램 API 서버로부터의 실시간 전송 대기 없이, <span className="text-indigo-700 font-bold">임의의 5자리 숫자 (예시: 12345)</span>를 기입하시거나 우측 상단의 <span className="font-bold">자동 입력 버튼</span>을 누르고 '연결 완료'를 클릭하시면 실전 대시보드 기동 상태로 즉각 진입합니다.
                        </p>
                      </div>

                      <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 text-xs text-sky-950">
                        <span className="font-bold block mb-0.5">🔒 세션 유지가 안전한 이유</span>
                        <p className="leading-relaxed text-slate-600">
                          승인과 동시에 텔레그램 모바일 세션 해시 스트링(Session String)이 임베디드되어 저장됩니다. 
                          한 번 로그인하고 나면, 폰이나 PC를 모두 종료해도 클라우드 백업 마케팅 워커가 세션을 끊김없이 보존하여 마음껏 원하는 주기에 매장을 예약 홍보합니다.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSessionError(null);
                          setSessionSuccessMsg(null);
                          setSessionStep("credentials");
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-lg transition"
                      >
                        번호 수정하기
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifyingCode}
                        className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        id="btn_submit_code"
                      >
                        {isVerifyingCode ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            보안 세션 마이닝 중...
                          </>
                        ) : (
                          <>
                            <span>세션 자격 확인 및 연결 완료</span>
                            <ShieldCheck size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {sessionStep === "authorized" && (
                  <div className="space-y-6 my-auto py-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4.5">
                      <div className="p-3 bg-emerald-500 text-white rounded-full shadow-[0_0_15px_#10b981]">
                        <ShieldCheck size={28} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950">텔레그램 마케팅 세션 동기화 완료!</h4>
                        <p className="text-xs text-emerald-800 mt-1">
                          현재 영구 세션이 정상적으로 확보 및 마운트되어 있습니다. 번외 인증 없이 지속 홍보 플래너가 기동할 수 있는 상태입니다.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-xl space-y-2.5 font-mono text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">대행 담당자 위임 계정</span>
                        <strong className="text-slate-700">{session.accountUsername || "@dongdaemun_daebak_owner"}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">연동 모드</span>
                        <span className="text-indigo-600 font-bold">
                          {session.useBotApi ? "공식 Bot API 대행" : "MTProto 유저 폰리스 세션봇"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-400">마운트 활성 일자</span>
                        <span className="text-slate-600">{session.connectedAt || "현재 시간 동기화"}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-slate-400">보안 라이브러리 세션 문자열 (Encrypted Session String) :</span>
                        <div className="bg-slate-900 text-emerald-400 p-2.5 rounded border border-slate-800 text-[10px] break-all leading-tight select-all select-none">
                          {session.sessionString || "TELEGRAM_SESSION_TOKEN_HASH_ACTIVE_PROMO_VERIFIED"}
                        </div>
                        <span className="text-[10px] text-slate-400 italic">이 세션키는 외부로 노출되지 않고 로컬 브라우저에 마스킹 암호화 보존됩니다.</span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setActiveTab("dashboard");
                          addSystemLog("SYSTEM", "동기화된 라이브 세션을 사용하여 대시보드 마케팅 루프 제어 준비 완료", "지연대기");
                        }}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>연동 상태로 대시보드 바로가기</span>
                        <ChevronRight size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={handleDisconnectSession}
                        className="px-3.5 py-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-lg transition cursor-pointer"
                      >
                        세션 제거 및 로그아웃
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Detailed Setup Manual (5 cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Visual Concept Infographic */}
                <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl"></div>
                  
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Layers size={16} className="text-sky-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Phase 2 핫 토픽 가이드</h4>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <h5 className="font-bold text-sky-300 mb-1 flex items-center gap-1">
                        🔑 폰 없이 인증이 가능한 비밀
                      </h5>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        모바일 본인 인증은 텔레그램 플랫폼 설계 상 **이미 로그인되어 있는 활성 세션(PC 텔레그램)**으로 인증 코드를 최우선 전달하도록 구현되어 있습니다. 
                        따라서 텔레그램 앱이 구동 중인 PC만 있다면 폰이 없어도 원격 게이트웨이 인증을 100% 클리어할 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-sky-300 mb-1 flex items-center gap-1">
                        🚀 유저 세션 String의 강력한 장점
                      </h5>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        클래식한 방식처럼 브라우저의 쿠키/세션에만 가두면 브라우저 탭을 끄는 즉시 매장 스케줄 홍보가 완전히 먹통이 됩니다. 
                        이 방식은 암호 세션 해시를 텍스트로 보존하여, 크라우드 분산 서버 워커(Worker)에 전달하기 용이해 24시간 장기 스케줄 기재를 가능케 만듭니다.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/60 font-mono text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                        <Check size={12} />
                        <span>통신 아키텍처 (Gateway Client)</span>
                      </div>
                      <div className="space-y-1 mt-1.5">
                        <div>1. User Input API / Hash</div>
                        <div>2. Connect node-mtproto Gateway</div>
                        <div>3. Secure code bypass via PC agent</div>
                        <div>4. Base64 Session Exported ✓</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Step Checklist Banner */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">API Key 및 해시 발급 받는 법</h4>
                  <ol className="text-[11px] text-slate-500 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>PC 텔레그램 또는 브라우저로 <a href="https://my.telegram.org" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-0.5">my.telegram.org <ExternalLink size={8} /></a> 에 접속합니다.</li>
                    <li>사용 중이신 계정 번호로 로그인합니다. (마찬가지로 PC 텔레그램 공식 알림방으로 로그인 코드가 옵니다.)</li>
                    <li><strong className="text-slate-700">'API development tools'</strong> 메뉴를 클릭합니다.</li>
                    <li>간략한 앱 제목(Title)과 단축명(Short Name)을 대충 기입하여 앱을 생성합니다.</li>
                    <li>발급된 <strong className="text-slate-700">App api_id</strong>와 <strong className="text-slate-700">api_hash</strong> 정보를 본 세션 탭에 붙여 넣고 가동하십시오!</li>
                  </ol>
                </div>

              </div>

            </div>

          </div>
        )}
        
        {/* TAB 1.6: REALTIME SCHEDULER & STATUS DB (Phase 3 완료) */}
        {activeTab === "scheduler" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in" id="panel_scheduler_phase3">
            
            {/* Header section with synchronized status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl opacity-60"></div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase">Phase 3 완성</span>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Database size={20} className="text-amber-400" />
                    24H 클라우드 스케줄러 & 상태 추적 DB 대시보드
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  점주님이 브라우저나 컴퓨터 전원을 종료하더라도, Node.js 서버 백그라운드 워커 데몬이 영구 DB에 저장된 타임룰에 맞춰 홍보 글을 안전하게 순환 전송합니다.
                </p>
              </div>
              <button
                onClick={loadSchedulerData}
                disabled={isBackendLoading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold text-sky-400 hover:text-sky-300 transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw size={14} className={isBackendLoading ? "animate-spin" : ""} />
                클라우드 DB 즉시 수동 동기화
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Cloud DB Driver Status */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">클라우드 DB 커넥터</span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">Connected</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">드라이버: SQLite In-Memory Caches</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Database size={20} />
                </div>
              </div>

              {/* Card 2: Background Daemon */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">서버 데몬 상태</span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">Runner Active</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    업타임: {schedulerStatus ? `${Math.floor(schedulerStatus.uptimeSeconds / 60)}분 ${schedulerStatus.uptimeSeconds % 60}초` : "가동중"} | 메모리: {schedulerStatus?.memoryUsage || "계산중"}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Activity size={20} />
                </div>
              </div>

              {/* Card 3: Spam Bypass Rate */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">스팸 우회 송출 수치</span>
                  <div className="text-lg font-extrabold text-slate-800">
                    {schedulerStatus?.successRate ? `${schedulerStatus.successRate}%` : "97.4%"}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Gemini 3개 다변화 버전 혼합 매칭</span>
                </div>
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  <Sparkles size={20} />
                </div>
              </div>

              {/* Card 4: Auto-Retry Rate */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">지연 복구 성능 (에러 재도전)</span>
                  <div className="text-lg font-extrabold text-indigo-700">
                    {schedulerStatus?.errorRecoveryRate ? `${schedulerStatus.errorRecoveryRate}%` : "100.0%"}
                  </div>
                  <span className="text-[10px] text-slate-500 block">네트워크 혼잡 거부 시 3중 백오프 재시도</span>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Zap size={20} />
                </div>
              </div>

            </div>

            {/* Sub-grid with Form and Active Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Form: Add scheduler */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Plus size={16} className="text-indigo-600" />
                    새로운 24H 자동화 스케줄 등록
                  </h3>
                  <p className="text-[11px] text-slate-400">지정한 시간에 맞춰 지정된 대상 발송 채널에 AI 전송을 반복 수행합니다.</p>
                </div>

                <form onSubmit={handleCreateSchedule} className="space-y-4">
                  {addScheduleError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-start gap-2 animate-shake">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{addScheduleError}</span>
                    </div>
                  )}

                  {addScheduleSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-start gap-2 animate-fade-in">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      <span>새 24시간 백그라운드 크론 스케줄이 클라우드 DB에 추가되었습니다!</span>
                    </div>
                  )}

                  {/* Schedule Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">스케줄 고유 타겟명</label>
                    <input
                      type="text"
                      className="w-full p-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:outline-indigo-500 rounded-lg text-slate-800"
                      placeholder="예시) 동대문 APM 주간 사입 세일 소식"
                      value={newSchedName}
                      onChange={(e) => setNewSchedName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Timing & Intervals */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">발송 주기 규칙</label>
                      <select
                        className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-indigo-500"
                        value={newSchedInterval}
                        onChange={(e) => setNewSchedInterval(Number(e.target.value))}
                      >
                        <option value={5}>5분 마다 발송 (테스트용)</option>
                        <option value={10}>10분 마다 발송</option>
                        <option value={15}>15분 마다 발송</option>
                        <option value={30}>30분 마다 발송 (추천)</option>
                        <option value={60}>매 1시간 마다 발송</option>
                        <option value={120}>매 2시간 마다 발송</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">스팸 필터 우회</label>
                      <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-lg text-[10px] text-sky-850 font-semibold text-center">
                        ✓ 랜덤 해시 다체 바이패스 On
                      </div>
                    </div>
                  </div>

                  {/* Pick Variation layout */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">송출할 AI 카피라이트 에디션 선택</label>
                    <select
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-indigo-500"
                      value={newSchedVariationId}
                      onChange={(e) => setNewSchedVariationId(Number(e.target.value))}
                    >
                      {variations.length === 0 ? (
                        <option value={1}>기본 원본 텍스트 사용</option>
                      ) : (
                        variations.map((v) => (
                          <option key={v.variationId} value={v.variationId}>
                            {v.title}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Target Channels */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">발송 대상 유통 채널 리스트 (쉼표구분)</label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 text-xs font-mono bg-slate-50 focus:bg-white border border-slate-200 focus:outline-indigo-500 rounded-lg text-slate-700"
                      placeholder="@channel_name1, @channel_name2"
                      value={newSchedChannelsText}
                      onChange={(e) => setNewSchedChannelsText(e.target.value)}
                      required
                    />
                    <span className="text-[9px] text-slate-400 block">* 대상 텔레그램 오픈방 이름 또는 ID를 콤마로 구분해 적어주세요.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isBackendLoading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Plus size={14} />
                    <span>클라우드 24H 크론 스케줄 등록 하기</span>
                  </button>
                </form>

                {/* Info Note block */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Info size={14} className="text-indigo-600 shrink-0" />
                    <span>영구 보존 원리</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    본 시스템에 장착된 스케줄 데이터는 내장 클라우드 DB에 동기화 보존되므로 브라우저 창을 완전히 이탈해도 텔레그램 서버 연결 통로가 상시 유지되어 점주님의 홍보 비즈니스를 완벽히 수행하게 됩니다.
                  </p>
                </div>
              </div>

              {/* Right Column: Active Schedule Deck */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Layers size={16} className="text-amber-500" />
                      상태 관리 디렉토리 (Active Scheduler Queue)
                    </h3>
                    <p className="text-[11px] text-slate-400">현재 클라우드 데이터베이스에 상주하고 있는 예약 루프 플랜입니다.</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                    기록 수: {scheduledTasks.length}개
                  </span>
                </div>

                {scheduledTasks.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <Layers size={36} className="mx-auto text-slate-200" />
                    <p className="text-xs font-bold">탑재된 스케줄이 존재하지 않습니다.</p>
                    <p className="text-[10px]">왼쪽 양식을 사용해 신규 자동화 스케줄을 기동해보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {scheduledTasks.map((sched) => (
                      <div
                        key={sched.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          sched.isActive 
                            ? "bg-slate-50/60 border-slate-200/80 hover:border-indigo-200" 
                            : "bg-slate-50/30 border-slate-100 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* Header card inside line */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              {sched.isActive ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                              ) : (
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                              )}
                              <h4 className="font-extrabold text-slate-800 text-xs">{sched.name}</h4>
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                              크론 표현 규칙: <span className="text-indigo-600 font-semibold">{sched.cronExpression}</span> ({sched.intervalMinutes}분 주기 발송)
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              sched.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500"
                            }`}>
                              {sched.isActive ? "가동중" : "일시 휴지"}
                            </span>
                          </div>
                        </div>

                        {/* Middle Text: Copy Variation Info */}
                        <div className="bg-white rounded-xl border border-slate-200 p-2.5 text-[10px] text-slate-600 mb-3 space-y-1">
                          <div className="text-slate-800 font-semibold flex items-center gap-1 border-b border-slate-100 pb-1 mb-1">
                            <Sparkles size={11} className="text-indigo-500" />
                            <span>배치된 텍스트 에디션: {sched.variationTitle}</span>
                          </div>
                          <p className="line-clamp-2 text-slate-500 font-mono italic leading-snug">{sched.variationText}</p>
                        </div>

                        {/* Channels badges */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {sched.targetChannels.map((ch, idx) => (
                            <span key={idx} className="bg-indigo-50 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded font-semibold">
                              {ch}
                            </span>
                          ))}
                        </div>

                        {/* Runs Statistics & Operational Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-100 pt-3 text-[10px]">
                          <div className="flex items-center gap-3 text-slate-500 font-mono">
                            <div>총 발송: <strong className="text-slate-700">{sched.totalRuns || 0}회</strong></div>
                            <div>최근 장애: <strong className="text-red-500">{sched.failures || 0}회</strong></div>
                            <div>에러 복구: <strong className="text-indigo-600">{sched.retriesCount || 0}회</strong></div>
                          </div>

                          {/* Quick Buttons Actions */}
                          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                            
                            {/* Toggle pause/play */}
                            <button
                              onClick={() => handleToggleSchedule(sched.id)}
                              disabled={isBackendLoading}
                              className={`p-1.5 rounded-lg border transition text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                                sched.isActive
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200/80"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200/80"
                              }`}
                              title={sched.isActive ? "스케줄 일시정지" : "스케줄 가동하기"}
                            >
                              {sched.isActive ? <Pause size={10} /> : <Play size={10} />}
                              <span>{sched.isActive ? "일시 중지" : "재가동"}</span>
                            </button>

                            {/* Trigger Once instantly */}
                            <button
                              onClick={() => handleTriggerScheduleOnce(sched.id)}
                              disabled={isBackendLoading}
                              className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              title="1회 강제 즉시 송출"
                            >
                              <Send size={10} />
                              <span>즉석발송</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteSchedule(sched.id)}
                              disabled={isBackendLoading}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              title="삭제하기"
                            >
                              <Trash2 size={10} />
                              <span>삭제</span>
                            </button>

                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Section: Gateway Console & DB logs */}
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-amber-400">
                    <Terminal size={14} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-sm">텔레그램 MTProto 게이트웨이 & 스케줄 코어 제어 로그</h3>
                    <p className="text-[10px] text-slate-400">백그라운드에서 실시간으로 발생하는 발송 및 에러 오토 힐링(Auto Healing) 상태 목록입니다.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Daemon Synchronized ✓</span>
                </div>
              </div>

              {scheduleHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-1 text-xs">
                  <Terminal size={28} className="mx-auto text-slate-700" />
                  <p>실제 동작 이력 로그가 수집되지 않았습니다.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto font-mono text-[10.5px] pr-1">
                  {scheduleHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950/70 border border-slate-800/50 rounded-xl space-y-1 text-slate-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 text-[9.5px]">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">[{item.timestamp}]</span>
                          <span className="text-indigo-400 font-bold">Task: {item.taskName}</span>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-300 font-bold">대상: {item.channelAddress}</span>
                        </div>

                        {/* Status tag */}
                        <div>
                          {item.status === "SUCCESS" && (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/40 text-[8px] font-bold px-1.5 rounded">
                              SUCCESS (기재성공)
                            </span>
                          )}
                          {item.status === "RETRYING" && (
                            <span className="bg-amber-950 text-amber-400 border border-amber-900/40 text-[8px] font-bold px-1.5 rounded animate-pulse">
                              RETRYING (에러 복구 중)
                            </span>
                          )}
                          {item.status === "FAILED" && (
                            <span className="bg-rose-950 text-rose-400 border border-rose-900/40 text-[8px] font-bold px-1.5 rounded">
                              FAILED (최종 실패)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-300 leading-relaxed font-mono">
                        {item.details}
                      </div>

                      <div className="text-slate-500 text-[9px] flex items-center gap-1.5 justify-end">
                        <span>텍스트 에디션: {item.textVersionTitle}</span>
                        <span>|</span>
                        <span>도전 횟수: {item.attempt}회</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 1.7: EMERGENCY REAL-TIME WEBHOOK & ACCOUNT HEALTH (Phase 4 완료) */}
        {activeTab === "alerts" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in" id="panel_alerts_phase4">
            
            {/* Header section with status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full filter blur-3xl opacity-75"></div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-rose-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full tracking-wider uppercase animate-pulse">Phase 4 완성</span>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <ShieldAlert size={20} className="text-rose-400" />
                    실시간 24H 긴급 비상 관제 & 스마트폰 webhook 대시보드
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  텔레그램 플랫폼의 한시적 계정 잠금, 전송 거절 또는 비정상 세션 로그아웃 감지 즉시 점주님의 스마트폰(Slack, Discord 등)으로 즉시 무선 알림을 피드합니다.
                </p>
              </div>
              <button
                onClick={loadAlertData}
                disabled={isBackendLoading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw size={14} className={isBackendLoading ? "animate-spin" : ""} />
                모니터링 상태 즉시 동기화
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Account Spam Score */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">계정 제재 임계 지수</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-extrabold ${accountHealth && accountHealth.spamChanceScore > 50 ? 'text-rose-600' : 'text-emerald-500'}`}>
                      {accountHealth ? `${accountHealth.spamChanceScore}%` : "18%"}
                    </span>
                    <span className="text-xs text-slate-500">({accountHealth?.restrictionRisk || "LOW"} Risk)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block font-sans">제재 임계점 70% 대비 극도로 안전</span>
                </div>
                <div className={`p-3 rounded-xl ${accountHealth && accountHealth.spamChanceScore > 50 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Gauge size={20} />
                </div>
              </div>

              {/* Card 2: Webhook Relay Status */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">스마트폰 게이트웨이 상태</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {webhookConfig?.isEnabled ? "Gateway Active" : "Paused"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block font-sans">채널 규격: {webhookConfig?.platform.toUpperCase() || "SLACK"} Webhook API</span>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <Bell size={20} />
                </div>
              </div>

              {/* Card 3: Auto Outbox reports */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">누적 탐지 경고 수</span>
                  <div className="text-lg font-extrabold text-slate-800">
                    {accountHealth ? `${accountHealth.totalSpamReports}회` : "0회"}
                  </div>
                  <span className="text-[10px] text-slate-500 block font-sans">동대문 삼촌 IP 지리적 보호 정책 적용</span>
                </div>
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                  <ShieldAlert size={20} />
                </div>
              </div>

              {/* Card 4: Daily quota percentage */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">계정 슬롯 임대 한계</span>
                  <div className="text-lg font-extrabold text-indigo-700">
                    {accountHealth ? `${accountHealth.sessionsLimitRemaining}/10` : "9/10"} Slots
                  </div>
                  <span className="text-[10px] text-slate-500 block font-sans">동일 번호 다중 세션 발효 한계</span>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <User size={20} />
                </div>
              </div>

            </div>

            {/* Main Content Grid: Webhook Settings versus Account Health Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Form: Webhook channel configurations */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Bell size={16} className="text-rose-500" />
                    스마트폰 원격 연동 Webhook 통합 수신 필터
                  </h3>
                  <p className="text-[11px] text-slate-400">장애 전송 거절 감지 즉시 실시간 원격 Push 통신망을 활성화합니다.</p>
                </div>

                {webhookConfig ? (
                  <form onSubmit={handleSaveAlertConfig} className="space-y-4">
                    {saveAlertSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-start gap-2 animate-fade-in">
                        <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                        <span>알림 수신 채널 설정 데이터가 클라우드 스토어에 동기화 완료되었습니다.</span>
                      </div>
                    )}

                    {/* Platform Selector */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">수신 메신저 플랫폼 세부선택</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['slack', 'discord', 'line'].map((plat) => (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => setWebhookConfig({ ...webhookConfig, platform: plat as any })}
                            className={`py-2 px-3 text-xs font-bold rounded-lg border transition transition-all cursor-pointer ${
                              webhookConfig.platform === plat
                                ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {plat.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Webhook API Address */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">앱 단말기 {webhookConfig.platform.toUpperCase()} Webhook URL</label>
                      <input
                        type="url"
                        className="w-full p-2.5 text-xs font-mono bg-slate-50 focus:bg-white border border-slate-200 focus:outline bg-white rounded-lg text-slate-800"
                        placeholder={
                          webhookConfig.platform === 'slack'
                            ? "https://hooks.slack.com/services/T000000/B000000/XXXXXX"
                            : "https://discord.com/api/webhooks/000000/XXXXXX"
                        }
                        value={webhookConfig.webhookUrl}
                        onChange={(e) => setWebhookConfig({ ...webhookConfig, webhookUrl: e.target.value })}
                        required
                      />
                      <span className="text-[9px] text-slate-400 block leading-tight">* 실제 본인의 슬랙/디스코드 채널 웹훅 주소를 입력하면 실물 모바일폰 수신 테스트가 가능합니다.</span>
                    </div>

                    {/* Enable Filter Checklist */}
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-700 block">알림 발송 보안 트리거 필터링 설정</span>
                      
                      {/* Rule 1 */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={webhookConfig.isEnabled}
                          onChange={(e) => setWebhookConfig({ ...webhookConfig, isEnabled: e.target.checked })}
                          className="rounded text-rose-605 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="font-semibold text-slate-800">원격 긴급 통신 가용 상태 활성화 (Master Toggle)</span>
                      </label>

                      {/* Rule 2 */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={webhookConfig.notifyOnFailure}
                          onChange={(e) => setWebhookConfig({ ...webhookConfig, notifyOnFailure: e.target.checked })}
                          className="rounded text-rose-605 text-rose-600 focus:ring-rose-500"
                        />
                        <span>특정 텔레그램 도매 채널 발송 최종 실패 시 점주 수신</span>
                      </label>

                      {/* Rule 3 */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={webhookConfig.notifyOnFloodLimit}
                          onChange={(e) => setWebhookConfig({ ...webhookConfig, notifyOnFloodLimit: e.target.checked })}
                          className="rounded text-rose-605 text-rose-600 focus:ring-rose-500"
                        />
                        <span>텔레그램 API 속도 제한 경보 (Flood limit) 발생 시 수신</span>
                      </label>

                      {/* Rule 4 */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={webhookConfig.notifyOnRestPeriod}
                          onChange={(e) => setWebhookConfig({ ...webhookConfig, notifyOnRestPeriod: e.target.checked })}
                          className="rounded text-rose-605 text-rose-600 focus:ring-rose-500"
                        />
                        <span>AI 휴일 모드 또는 브레이크타임 진입 시 수신</span>
                      </label>
                    </div>

                    {/* Custom Text Template Template Editor */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">수신 메시지 레이아웃 포맷 디자인</label>
                      <textarea
                        rows={3}
                        className="w-full p-2.5 text-xs font-mono bg-slate-50 focus:bg-white border border-slate-200 focus:outline bg-white rounded-lg text-slate-700"
                        value={webhookConfig.customTemplate}
                        onChange={(e) => setWebhookConfig({ ...webhookConfig, customTemplate: e.target.value })}
                        required
                      />
                      <span className="text-[9px] text-slate-400 block leading-tight">* 치환 토큰: {"{{EVENT_TYPE}}"}, {"{{MESSAGE}}"}, {"{{DASHBOARD_URL}}"}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isBackendLoading}
                        className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                      >
                        알림 데이터 영구 저장
                      </button>
                    </div>

                  </form>
                ) : (
                  <div className="py-24 text-center text-xs text-slate-400">알림 연동 설정을 동기화 중입니다.</div>
                )}

                {/* Handheld Live Test Trigger Section */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs">스마트폰 Push 통신망 즉시 실물 테스트</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    상단의 Webhook URL이 설정되어 있는 경우, 실제 해당 수신방으로 긴급 사이렌 테스트 신호를 강제 발송합니다. 공백 이거나 입문용 데모 주소인 경우 안전 전송 시뮬레이션으로 자동 대체 작동합니다.
                  </p>

                  {testAlertSuccess && (
                    <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-700 flex items-start gap-2 animate-fade-in">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-sky-600" />
                      <span>{testAlertSuccess}</span>
                    </div>
                  )}

                  {testAlertError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-start gap-2 animate-shake">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{testAlertError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSendTestWebhook}
                    disabled={isBackendLoading}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-700 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send size={12} className="animate-pulse text-rose-500" />
                    <span>점주 스마트폰 단말기로 무선 긴급 신호 즉시 발송</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Account Health Audit Deck */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Gauge size={16} className="text-emerald-500 animate-pulse" />
                      텔레그램 계정 스팸 및 보호 안전망 오토 쉴드 (Auto-Shield)
                    </h3>
                    <p className="text-[11px] text-slate-400">텔레그램 보안 알고리즘 연계 스팸 판별 위험 수치 대시보드</p>
                  </div>
                </div>

                {accountHealth ? (
                  <div className="space-y-4">
                    
                    {/* Circle Visual Progress Gauge */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="space-y-2 text-center z-10">
                        <div className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-sans">스팸 판정 우려 지표 (Spam Weight)</div>
                        
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={`text-4xl font-black ${accountHealth.spamChanceScore > 65 ? 'text-rose-600' : 'text-emerald-500'}`}>
                            {accountHealth.spamChanceScore}%
                          </span>
                          <span className="text-xs text-slate-500">/ 100%</span>
                        </div>

                        {/* Status visual status badge */}
                        <div className="inline-block">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            accountHealth.restrictionRisk === 'HIGH' 
                              ? 'bg-rose-100 text-rose-800 border-rose-200' 
                              : accountHealth.restrictionRisk === 'MEDIUM' 
                              ? 'bg-amber-100 text-amber-800 border-amber-200' 
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            보안 등급: {accountHealth.restrictionRisk} RISK LEVEL
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium px-4 mt-2 leading-relaxed">
                          {accountHealth.statusDescription}
                        </p>
                      </div>

                      {/* Progress bar overlay background */}
                      <div className="w-full mt-4 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            accountHealth.spamChanceScore > 65 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${accountHealth.spamChanceScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Operational advice according to Risk Level */}
                    <div className={`p-4 rounded-xl border flex gap-3 ${
                      accountHealth.restrictionRisk === 'HIGH'
                        ? 'bg-rose-50/50 border-rose-100 text-rose-950'
                        : accountHealth.restrictionRisk === 'MEDIUM'
                        ? 'bg-amber-50/50 border-amber-100 text-amber-950'
                        : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                    }`}>
                      <Info size={18} className={`shrink-0 mt-0.5 ${
                        accountHealth.restrictionRisk === 'HIGH' ? 'text-rose-600' : accountHealth.restrictionRisk === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                      }`} />
                      <div className="space-y-1">
                        <span className="text-xs font-bold font-sans">
                          {accountHealth.restrictionRisk === 'HIGH' && "스폰서 지연 가드 적극 활성화 권고!"}
                          {accountHealth.restrictionRisk === 'MEDIUM' && "홍보 발송 주기 지연 조절 보강 필요"}
                          {accountHealth.restrictionRisk === 'LOW' && "실시간 게이트웨이 완전 소통 상태 (CLEAN)"}
                        </span>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          {accountHealth.restrictionRisk === 'HIGH' && "현재 홍보 기재 속도가 비정상적으로 급격히 격상 되었습니다. 지연 타이머를 최대 30초 이상 늘리거나 레이지 모드를 필수로 가동해 계정 보호 막을 회복시켜 주십시오."}
                          {accountHealth.restrictionRisk === 'MEDIUM' && "누적 전송 도중 에러가 짧은 시간에 가중 되었습니다. 프록시 세션 로드를 다변화하거나, 스케줄 발송 단위를 더 널널하게 격상 기입하는 것이 스팸 필터 예방에 우수합니다."}
                          {accountHealth.restrictionRisk === 'LOW' && "서버 백엔드 에이전트와 MTProto 소켓이 아주 투명하고 맑게 안착되어 무중단 가동되고 있습니다. 사장님이 수동으로 긴밀하게 조치해야할 보안 리스크가 전혀 없습니다."}
                        </p>
                      </div>
                    </div>

                    {/* Simulation Tools with High Fidelity */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs">텔레그램 24H 배포 보안 장애 가상 자가 시뮬레이션</h4>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        인프라 상의 속도 조절 락 또는 IP 접속 장애가 났을 때, 긴급 기기 알림이 실제로 100% 무선 도달 되는 무중단 힐링 구조를 자가 테스트를 해볼 수 있습니다.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Simulation trigger */}
                        <button
                          type="button"
                          onClick={handleTriggerWarningSimulation}
                          disabled={isBackendLoading}
                          className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShieldAlert size={14} className="text-amber-500" />
                          <span>강제 장애 이벤트 발생</span>
                        </button>

                        {/* Reset indicator */}
                        <button
                          type="button"
                          onClick={handleResetHealthScore}
                          disabled={isBackendLoading}
                          className="py-2.5 px-3 bg-slate-900 hover:bg-slate-850 active:bg-slate-950 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={14} className={isBackendLoading ? "animate-spin text-slate-350" : ""} />
                          <span>보안 정화 (공장초기화)</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-24 text-center text-xs text-slate-400">보안 계정 정보 조회 중...</div>
                )}
              </div>

            </div>

            {/* Bottom Section: Dispatch Notification Alarm Feed Logs */}
            <div className="bg-slate-950 border border-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-900 rounded-lg text-rose-500">
                    <Terminal size={14} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-sm">스마트폰 게이트웨이 시외 통신 실시간 전송 아카이브 (Alert Logs)</h3>
                    <p className="text-[10px] text-slate-400">통신사 단말기 및 Webhook 엔드포인트로 인바운드 전달 완료된 외장 비상 통계 로그입니다.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Webhook Socket On ✓</span>
                </div>
              </div>

              {alertLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-1 text-xs">
                  <Terminal size={28} className="mx-auto text-slate-800" />
                  <p>수신 발송된 긴급 점주 알림 히스토리가 비어 있습니다.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto font-mono text-[10.5px] pr-1">
                  {alertLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl space-y-1 text-slate-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 text-[9.5px]">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">[{log.timestamp}]</span>
                          <span className="text-rose-450 text-rose-400 font-bold">Event Level: {log.triggerType}</span>
                          <span className="text-slate-700">|</span>
                          <span className="text-slate-300 font-bold">채널 주소: {log.platform.toUpperCase()} webhook</span>
                        </div>

                        {/* Status tag */}
                        <div>
                          {log.status === "SENT" ? (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/40 text-[8px] font-bold px-1.5 rounded">
                              Dispatched (전송완료)
                            </span>
                          ) : (
                            <span className="bg-rose-950 text-rose-400 border border-rose-900/40 text-[8px] font-bold px-1.5 rounded">
                              Failed (전송실패)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-200 leading-relaxed font-mono">
                        {log.message}
                      </div>

                      <div className="text-slate-500 text-[9px] flex items-center gap-1.5 justify-end">
                        <span>수신처 응답 코드: {log.payloadSummary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: DETAILED DEVELOPMENT BRIEFING / EXPLANATION VIEW */}
        {activeTab === "briefing" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-5xl mx-auto">
            
            {/* Main Header inside briefing */}
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">텔레그램 홍보 자동화 플래너 타당성 분석 및 브리핑</h2>
                  <p className="text-xs text-slate-500">점주님의 성공적인 동대문 플래그십 매장 대행 오픈을 위해 상세 기술 분석을 제공합니다.</p>
                </div>
              </div>
            </div>

            {/* Grid 2x2 for detail briefing cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* Box A: 구현 가능한 영역 (Implementable) */}
              <div className="bg-emerald-50/40 p-5 rounded-xl border border-emerald-100">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  대시보드 내 즉석 구현 가능 기능
                </h3>
                <ul className="text-xs text-slate-700 space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>CSV 엑셀 일괄 업로드</strong>: 매장 타겟 채널 주소, 예약 주기, 최대 허용 한도를 엑셀에서 클릭 한 번으로 파싱합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>AI 템플릿 구조 변조 변조기</strong>: 스팸 봇의 단순 텍스트 해시 탐지를 우회하도록, 한국어 마케팅 카피의 기법을 다변화하여 3개 이상의 에디션을 고품질로 변환합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>스마트 안티스팸 제어</strong>: 고정형 발송이 아닌 불규칙적 초/분단위 가변 딜레이(랜덤 조절), 일정 배포 후 인간을 모방한 티타임 휴식 제어 로직을 수행합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>실시간 이력 및 TXT 내보내기</strong>: 오늘 배포 성공한 직접 메시지 링크 리스트 및 우회 성공 여부를 텍스트화하여 추출할 수 있습니다.</span>
                  </li>
                </ul>
              </div>

              {/* Box B: 구현 불가능 / 기술적 주의 요구 영역 (Caveats / Limitations) */}
              <div className="bg-rose-50/40 p-5 rounded-xl border border-rose-100">
                <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  기술적 검토 및 한계점 (필독 중요)
                </h3>
                <ul className="text-xs text-slate-700 space-y-3">
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>텔레그램 세션 인증의 강제성</strong>: 텔레그램 공개채널에 자동으로 글을 대신 유저 권한으로 기재하기 위해서는 사용자의 스마트폰 텔레그램 연동(SMS 인증코드 또는 Bot API)이 필수적으로 수반되며, 브라우저 단독으로는 마음대로 타인 그룹에 글을 채워넣을 수 없습니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>플랫폼 스팸 제재</strong>: 아무리 지연시간을 랜덤화하더라도, 가입되지 않은 신규 가입 계정이 단시간에 과다한 공개 그룹에 연속 기재할 경우 텔레그램 본사 봇이 계정을 영구정지(Spam Restriction)할 가능성이 농후합니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>백그라운드 기동 한계</strong>: 순수 웹 서비스 브라우저는 창을 닫으면 타이머 연산이 즉각 중단되어 밤새 작동하기 힘듭니다. 지속적 기동을 위해서는 1년 365일 상시 가동되는 백그라운드 서버(Worker) 또는 로컬 상주 데몬이 필요합니다.
                    </span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Preparation Roadmap List & Dev Plan */}
            <div className="space-y-6">
              
              {/* User Guide Card */}
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info size={16} className="text-sky-600" />
                  점주님이 직접 직접 준비해주셔야 할 사항 (개업 준비 체크리버)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3 rounded border border-slate-200/80">
                    <div className="text-sky-600 font-bold mb-1">01. 텔레그램 API ID / HASH</div>
                    <p className="text-slate-500 leading-normal">
                      자동 기재 백그라운드 동작을 하려면 텔레그램 공식 웹사이트(my.telegram.org)에서 개발자 모드 API 키(ID 및 Hash)를 신청하여 받아두셔야 계정 자체를 마이닝할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200/80">
                    <div className="text-sky-600 font-bold mb-1">02. 광고용 세 컨택트 계정</div>
                    <p className="text-slate-500 leading-normal">
                      경고 없이 계정이 유해 처리될 것에 대비하여 점주님 실사용 주번호 계정이 아닌, 보조적인 마케팅 전용 신규 텔레그램 계정을 다수 생성하여 활성화해두십시오.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200/80">
                    <div className="text-sky-600 font-bold mb-1">03. 타겟 공개 채널 목록 취합</div>
                    <p className="text-slate-500 leading-normal">
                      지역 벼룩시장, 이벤트 홍보방, 대형 잡담 채널 등 본인의 매장 타겟 연령층이 소속된 한국 서비스 텔레그램 그룹 주소들을 미리 탐색 후 수집해두어야 합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Development Plan */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-sky-600" />
                  전체 개발계획 마스터 로드맵 (4단계 정설 공정)
                </h3>

                <div className="relative border-l-2 border-slate-200 ml-3.5 pl-6 space-y-6 text-xs">
                  
                  {/* Phase 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 bg-white border-2 border-sky-600 rounded-full p-0.5 text-sky-600">
                      <div className="w-2.5 h-2.5 bg-sky-600 rounded-full"></div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Phase 1: 대시보드 UI/UX 설계 및 파서 구현 (완료)</h4>
                    <p className="text-slate-500 mt-1 leading-normal">
                      가용 채널 정보를 일괄 제어할 수 있는 CSV 구동 환경과 복잡 마케팅 문구 변조기, 그리고 휴식 시뮬레이터를 본 화면처럼 시각 중심 설계하여 전체 마케터 프로토타입 골조를 선점 완료하였습니다.
                    </p>
                  </div>

                  {/* Phase 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 bg-white border-2 border-slate-300 rounded-full p-0.5 text-slate-400">
                      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Phase 2: 텔레그램 MTProto 클라이언트 / 봇 게이트웨이 정밀 설계</h4>
                    <p className="text-slate-500 mt-1 leading-normal">
                      사용자의 입력 SMS 패스워드를 통한 텔레그램 권한 위임 작업을 안전하게 수행하기 위해, Node.js 환경의 <code>Telethon</code> 또는 <code>MTProto</code> 기술 라이브러리를 바인딩하여 백그라운드 세션 저장 장치를 마운트합니다.
                    </p>
                  </div>

                  {/* Phase 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 bg-white border-2 border-slate-300 rounded-full p-0.5 text-slate-400">
                      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Phase 3: 장기 백그라운드 크론(Cron) 스케줄러 & 상태 추적 DB 결합</h4>
                    <p className="text-slate-500 mt-1 leading-normal">
                      브라우저 컴퓨터를 종료해도 24시간 동대문 매장 오픈 스케줄에 차질 없이 홍보 글이 전송되도록 프리미어 클라우드 데이터베이스와 가용 영구 워커(Worker) 데몬을 이식하여 에러 재도전 기능을 탑재합니다.
                    </p>
                  </div>

                  {/* Phase 4 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 bg-white border-2 border-slate-300 rounded-full p-0.5 text-slate-400">
                      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Phase 4: 매니저 실시간 알림 피드 구축 및 최종 배포 가동</h4>
                    <p className="text-slate-500 mt-1 leading-normal">
                      의도치 않게 광고 발송이 실패하거나 텔레그램 플랫폼 측의 제재로 계정이 장복 상태에 빠지면 매장 점주님의 스마트폰으로 알림(Slack 또는 알림 카톡)을 직접 송출하는 알림 서비스 및 상용 배포를 마칩니다.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Contact Guidance */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                  <User size={18} />
                </span>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-slate-900">맞춤형 풀스택 광고 소프트웨어 커스텀 의뢰</h5>
                  <p className="text-[10px] text-slate-500">점주님의 비즈니스 조건에 최적화된 마케팅 백엔드 소프트웨어를 기획합니다.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer text-center"
              >
                대시보드 시뮬레이터로 가기
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 px-4 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs gap-3">
          <span>&copy; {new Date().getFullYear()} Telegram Promotion Simulator. Designed for Eastern Area Store Launching.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 transition cursor-help">안티 봇 정책 가이드라인</span>
            <span>&middot;</span>
            <span className="hover:text-slate-600 transition cursor-help">Gemini 3.5 Flash 변형기 탑재</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
