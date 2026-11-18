import {useEffect, useMemo, useState} from 'react';
import {
  ArrowLeft,
  BatteryFull,
  Bell,
  ChevronRight,
  Compass,
  Home,
  Layers,
  Maximize2,
  Search,
  Settings,
  Signal,
  Smartphone,
  Wifi,
} from 'lucide-react';
import {
  DEFAULT_PHONE_MODEL_ID,
  PHONE_MODELS,
  type PhoneBrand,
  type PhoneModelSpec,
} from '../data/phoneModels';
import {detectPhoneModel, type DetectionSource} from '../utils/detectPhoneModel';

type AppTab = 'home' | 'explore' | 'activity' | 'settings';

interface AppTemplateProps {
  onBackToSite: () => void;
}

const APP_TABS: {
  id: AppTab;
  label: string;
  note: string;
  icon: typeof Home;
}[] = [
  {
    id: 'home',
    label: '홈',
    note: '첫 진입 시 핵심 기능과 검색이 바로 보이도록 배치한 시작 화면',
    icon: Home,
  },
  {
    id: 'explore',
    label: '기능',
    note: '주요 기능 모듈을 카드 단위로 살펴보고 실행할 수 있는 화면',
    icon: Compass,
  },
  {
    id: 'activity',
    label: '목록',
    note: '세부 항목을 필터링하고 선택 상태를 확인하는 리스트 화면',
    icon: Layers,
  },
  {
    id: 'settings',
    label: '설정',
    note: '기종 해상도 정보와 기본 환경 제어를 확인할 수 있는 화면',
    icon: Settings,
  },
];

function SmartphoneScreenContent({
  model,
  detectionSource,
  isManualSelection,
  activeTab,
  setActiveTab,
  selectedItem,
  setSelectedItem,
  searchQuery,
  setSearchQuery,
  notificationsEnabled,
  setNotificationsEnabled,
  showHardwareOverlay,
  isRealMobile,
  onBackToSite,
}: {
  model: PhoneModelSpec;
  detectionSource: DetectionSource;
  isManualSelection: boolean;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedItem: number;
  setSelectedItem: (item: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
  showHardwareOverlay: boolean;
  isRealMobile: boolean;
  onBackToSite: () => void;
}) {
  const detectionLabel = isManualSelection
    ? '수동 선택'
    : detectionSource === 'exact-model'
      ? '기기 자동 감지'
      : detectionSource === 'screen-size'
        ? '화면 비율 감지'
        : '기본 기종 적용';
  const isIphone = model.brand === 'iphone';
  const filteredSlots = [1, 2, 3, 4].filter((item) => {
    if (!searchQuery.trim()) return true;
    return `템플릿 항목 0${item}`.includes(searchQuery.trim()) || `0${item}`.includes(searchQuery.trim());
  });

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#F5F5F7] text-neutral-950 select-none">
      {/* OS Status Bar & Hardware Cutout (Desktop frame preview only) */}
      {showHardwareOverlay && (
        <div
          className={`relative z-20 flex shrink-0 items-center justify-between px-6 ${
            model.cutout === 'dynamic-island'
              ? 'h-[50px] pt-2'
              : model.cutout === 'notch'
                ? 'h-[44px] pt-1.5'
                : 'h-[40px] pt-1.5'
          }`}
        >
          <span className="w-12 text-[13px] font-semibold tracking-tight tabular-nums text-neutral-950">
            {model.statusTime}
          </span>

          {model.cutout === 'dynamic-island' && (
            <div
              aria-hidden="true"
              className="h-[28px] w-[108px] rounded-full bg-neutral-950 shadow-inner"
            />
          )}
          {model.cutout === 'notch' && (
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 h-[26px] w-[142px] -translate-x-1/2 rounded-b-2xl bg-neutral-950"
            />
          )}
          {model.cutout === 'punch-hole' && (
            <div
              aria-hidden="true"
              className="h-[14px] w-[14px] rounded-full bg-neutral-950 ring-2 ring-neutral-900/20"
            />
          )}

          <div className="flex w-12 items-center justify-end gap-1.5 text-neutral-950">
            <Signal className="h-3.5 w-3.5" strokeWidth={2.2} />
            <Wifi className="h-3.5 w-3.5" strokeWidth={2.2} />
            <BatteryFull className="h-4 w-4" strokeWidth={2.2} />
          </div>
        </div>
      )}

      {/* Smartphone App Navigation Header */}
      <div
        className={`shrink-0 border-b border-neutral-200/80 bg-[#F5F5F7]/95 px-4 pb-3 backdrop-blur-md ${
          isRealMobile ? 'pt-3' : 'pt-2'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {isRealMobile && (
              <button
                type="button"
                onClick={onBackToSite}
                aria-label="소개 웹사이트로 이동"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-700 shadow-xs transition-colors hover:bg-neutral-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-neutral-500">
                {isRealMobile ? '앱 템플릿' : `${model.name} · ${model.osLabel}`}
              </p>
              <h2 className="truncate text-lg font-bold tracking-tight text-neutral-950">
                {activeTab === 'home' && '홈'}
                {activeTab === 'explore' && '기능'}
                {activeTab === 'activity' && '목록'}
                {activeTab === 'settings' && '설정'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            aria-label="설정 화면으로 이동"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-700 shadow-xs transition-colors hover:bg-neutral-100"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Smartphone Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl bg-neutral-200/70 px-3 py-2.5 text-neutral-600">
              <Search className="h-4 w-4 shrink-0 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setActiveTab('activity');
                  }
                }}
                placeholder="앱 내 항목 검색"
                className="w-full bg-transparent text-[13px] text-neutral-950 placeholder:text-neutral-500 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl bg-neutral-950 p-5 text-white">
              <p className="text-[11px] text-neutral-400">앱 템플릿</p>
              <h3 className="mt-1 text-base font-semibold leading-snug">
                스마트폰 앱 화면이 정상 실행 중입니다
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-300">
                {isRealMobile
                  ? '모바일 화면 비율에 맞춰 전체 앱 화면으로 표시되고 있습니다.'
                  : `${model.name} (${model.width}×${model.height} px) 뷰포트 기준으로 표시됩니다.`}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                className="mt-4 inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-neutral-950 transition-transform active:scale-[0.98]"
              >
                <span>기능 화면 열기</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                className="flex flex-col items-start justify-between rounded-2xl bg-white p-4 text-left shadow-xs transition-transform active:scale-[0.98]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                  <Compass className="h-4 w-4" />
                </div>
                <div className="mt-4">
                  <span className="block text-sm font-semibold text-neutral-950">핵심 기능</span>
                  <span className="block text-[11px] text-neutral-500">카드 모듈 슬롯</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activity')}
                className="flex flex-col items-start justify-between rounded-2xl bg-white p-4 text-left shadow-xs transition-transform active:scale-[0.98]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="mt-4">
                  <span className="block text-sm font-semibold text-neutral-950">항목 목록</span>
                  <span className="block text-[11px] text-neutral-500">리스트 뷰 슬롯</span>
                </div>
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-xs">
              <div className="border-b border-neutral-100 px-4 py-3">
                <span className="text-xs font-semibold text-neutral-500">빠른 전환</span>
              </div>
              {[1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedItem(idx);
                    setActiveTab('activity');
                  }}
                  className="flex min-h-[50px] w-full items-center justify-between border-b border-neutral-100 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-neutral-50"
                >
                  <div>
                    <span className="block text-[13px] font-medium text-neutral-950">
                      화면 슬롯 0{idx}
                    </span>
                    <span className="block text-[11px] text-neutral-500">
                      탭하여 상세 목록으로 이동
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="space-y-3">
            {[1, 2, 3].map((slot) => (
              <div key={slot} className="rounded-2xl bg-white p-4 shadow-xs">
                <div>
                  <span className="text-[11px] font-medium tabular-nums text-neutral-400">
                    모듈 0{slot}
                  </span>
                  <h3 className="mt-0.5 text-sm font-semibold text-neutral-950">
                    앱 기능 영역 0{slot}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                    슬라이드에서 소개한 주요 기능의 모바일 인터페이스가 들어갈 자리입니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(slot);
                    setActiveTab('activity');
                  }}
                  className="mt-3 flex min-h-[40px] w-full items-center justify-center rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
                >
                  목록에서 선택
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-neutral-200/70 px-3 py-2 text-neutral-600">
              <Search className="h-4 w-4 shrink-0 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="항목 필터링"
                className="w-full bg-transparent text-[13px] text-neutral-950 placeholder:text-neutral-500 focus:outline-none"
              />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-xs">
              {filteredSlots.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-neutral-500">
                  일치하는 항목이 없습니다
                </div>
              ) : (
                filteredSlots.map((item) => {
                  const isSelected = selectedItem === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={`flex min-h-[56px] w-full items-center justify-between border-b border-neutral-100 px-4 py-3 text-left transition-colors last:border-b-0 ${
                        isSelected ? 'bg-neutral-100/80' : 'bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div>
                        <span className="block text-[13px] font-semibold text-neutral-950">
                          템플릿 항목 0{item}
                        </span>
                        <span className="block text-[11px] text-neutral-500">
                          {isSelected ? '현재 선택된 항목입니다' : '탭하여 항목을 선택하세요'}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-500">
                        {isSelected ? '선택됨' : '열기'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xs">
              <div className="flex min-h-[52px] items-center justify-between border-b border-neutral-100 px-4 py-3">
                <span className="text-[13px] text-neutral-700">적용된 기종</span>
                <span className="text-[13px] font-semibold text-neutral-950">
                  {model.name} ({detectionLabel})
                </span>
              </div>
              <div className="flex min-h-[52px] items-center justify-between border-b border-neutral-100 px-4 py-3">
                <span className="text-[13px] text-neutral-700">CSS 뷰포트</span>
                <span className="text-[13px] font-medium tabular-nums text-neutral-600">
                  {model.width} × {model.height} px
                </span>
              </div>
              <div className="flex min-h-[52px] items-center justify-between border-b border-neutral-100 px-4 py-3">
                <span className="text-[13px] text-neutral-700">물리 해상도</span>
                <span className="text-[13px] font-medium tabular-nums text-neutral-600">
                  {model.physicalResolution}
                </span>
              </div>
              <div className="flex min-h-[52px] items-center justify-between border-b border-neutral-100 px-4 py-3">
                <span className="text-[13px] text-neutral-700">앱 알림 예시 토글</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationsEnabled}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    notificationsEnabled ? 'bg-neutral-950' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {isRealMobile && (
                <button
                  type="button"
                  onClick={onBackToSite}
                  className="flex min-h-[52px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <span className="text-[13px] font-medium text-neutral-950">
                    소개 웹사이트로 이동
                  </span>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Smartphone Bottom Tab Bar */}
      <nav
        aria-label="스마트폰 앱 하단 탭"
        className="shrink-0 border-t border-neutral-200/80 bg-white/95 backdrop-blur-md"
      >
        <div
          className={`grid grid-cols-4 px-2 pt-1.5 ${
            isRealMobile ? 'pb-[max(0.5rem,env(safe-area-inset-bottom))]' : 'pb-1'
          }`}
        >
          {APP_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl transition-colors ${
                  isActive ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <Icon className="h-[19px] w-[19px]" strokeWidth={isActive ? 2.25 : 1.75} />
                <span className="mt-0.5 text-[10px] font-medium tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {showHardwareOverlay && (
          <div className="flex h-5 items-center justify-center">
            {isIphone ? (
              <div className="h-[4px] w-[124px] rounded-full bg-neutral-950/85" />
            ) : (
              <div className="h-[4px] w-[96px] rounded-full bg-neutral-400" />
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export function AppTemplate({onBackToSite}: AppTemplateProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_PHONE_MODEL_ID);
  const [detectionSource, setDetectionSource] = useState<DetectionSource>('fallback');
  const [isManualSelection, setIsManualSelection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedItem, setSelectedItem] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [desktopFullScreen, setDesktopFullScreen] = useState<boolean>(false);
  const [viewport, setViewport] = useState<{width: number; height: number}>(() => {
    if (typeof window === 'undefined') return {width: 1440, height: 900};
    return {width: window.innerWidth, height: window.innerHeight};
  });

  useEffect(() => {
    let cancelled = false;
    detectPhoneModel().then((result) => {
      if (cancelled) return;
      setDetectionSource(result.source);
      setSelectedModelId((prev) => (isManualSelection ? prev : result.modelId));
    });
    return () => {
      cancelled = true;
    };
  }, [isManualSelection]);

  useEffect(() => {
    const onResize = () => {
      setViewport({width: window.innerWidth, height: window.innerHeight});
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobileViewport = viewport.width < 768;

  const selectedModel = useMemo(
    () => PHONE_MODELS.find((m) => m.id === selectedModelId) ?? PHONE_MODELS[0],
    [selectedModelId],
  );

  const selectedBrand: PhoneBrand = selectedModel.brand;

  const brandModels = useMemo(
    () => PHONE_MODELS.filter((m) => m.brand === selectedBrand),
    [selectedBrand],
  );

  const handleSelectBrand = (brand: PhoneBrand) => {
    if (brand === selectedBrand) return;
    const firstOfBrand = PHONE_MODELS.find((m) => m.brand === brand);
    if (firstOfBrand) {
      setIsManualSelection(true);
      setSelectedModelId(firstOfBrand.id);
    }
  };

  const handleSelectModel = (modelId: string) => {
    setIsManualSelection(true);
    setSelectedModelId(modelId);
  };

  // Real smartphone viewport: render pure full-screen smartphone app with zero desktop bezel/comments
  if (isMobileViewport) {
    return (
      <main className="h-dvh w-full overflow-hidden bg-[#F5F5F7]">
        <SmartphoneScreenContent
          model={selectedModel}
          detectionSource={detectionSource}
          isManualSelection={isManualSelection}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          showHardwareOverlay={false}
          isRealMobile={true}
          onBackToSite={onBackToSite}
        />
      </main>
    );
  }

  // Desktop optional fullscreen toggle
  if (desktopFullScreen) {
    return (
      <div className="flex h-screen flex-col bg-[#F5F5F7]">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 py-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>소개 웹으로 돌아가기</span>
          </button>

          <span className="text-xs font-medium text-neutral-500">{selectedModel.name}</span>

          <button
            type="button"
            onClick={() => setDesktopFullScreen(false)}
            className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-medium text-neutral-800 hover:text-neutral-950"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>기종 프레임 보기</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <SmartphoneScreenContent
            model={selectedModel}
            detectionSource={detectionSource}
            isManualSelection={isManualSelection}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            showHardwareOverlay={false}
            isRealMobile={false}
            onBackToSite={onBackToSite}
          />
        </div>
      </div>
    );
  }

  // Desktop 50/50 balanced single-screen view: Left unified comments + Right phone frame
  const bezelPadding = 24;
  const totalFrameWidth = selectedModel.width + bezelPadding;
  const totalFrameHeight = selectedModel.height + bezelPadding;
  const availableWidth = Math.max(360, Math.min(480, viewport.width * 0.42));
  const availableHeight = Math.max(520, viewport.height - 64);
  const frameScale = Math.min(
    1,
    availableWidth / totalFrameWidth,
    availableHeight / totalFrameHeight,
  );

  return (
    <div className="h-screen overflow-hidden bg-[#F3F2EE] text-neutral-950 antialiased">
      <div className="mx-auto grid h-full max-w-5xl grid-cols-2 items-center gap-12 px-6 py-8 lg:gap-16">
        {/* Left Column: Unified Cohesive Comment Block */}
        <aside className="flex flex-col justify-center space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors hover:text-neutral-950 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>소개 웹으로 돌아가기</span>
            </button>

            <button
              type="button"
              onClick={() => setDesktopFullScreen(true)}
              className="inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors hover:text-neutral-950 whitespace-nowrap shrink-0"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>전체 화면</span>
            </button>
          </div>

          <div className="space-y-4 border-t border-neutral-300/70 pt-6">
            <p className="text-xs tracking-wider text-neutral-500">앱 코멘트</p>

            <h1
              className="text-2xl font-semibold leading-snug tracking-tight text-neutral-950"
              style={{textWrap: 'balance'}}
            >
              발표 시 앱과 함께 띄워두는 설명 코멘트
            </h1>

            <p className="text-sm leading-relaxed text-neutral-600">
              오른쪽 스마트폰 화면을 직접 조작하면서 왼쪽 코멘트 영역에 앱의 기획 의도와 핵심
              흐름을 한눈에 정리해 보여주는 템플릿입니다.
            </p>

            <ul className="space-y-2.5 pt-2">
              {APP_TABS.map((tab, idx) => {
                const isCurrent = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-start gap-3 text-left text-sm leading-relaxed transition-colors ${
                        isCurrent ? 'text-neutral-950' : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      <span className="mt-0.5 text-xs font-medium tabular-nums text-neutral-400">
                        0{idx + 1}
                      </span>
                      <span>
                        <strong className="font-semibold text-neutral-900">{tab.label}</strong>
                        <span aria-hidden="true" className="mx-1.5 text-neutral-300">
                          ·
                        </span>
                        <span>{tab.note}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Integrated Device Switcher */}
          <div className="space-y-2.5 border-t border-neutral-300/70 pt-5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectBrand('iphone')}
                  className={`font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedBrand === 'iphone'
                      ? 'text-neutral-950 underline underline-offset-4'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  iPhone
                </button>
                <span aria-hidden="true" className="text-neutral-300">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectBrand('galaxy')}
                  className={`font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedBrand === 'galaxy'
                      ? 'text-neutral-950 underline underline-offset-4'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Galaxy S Ultra
                </button>
              </div>

              <span className="tabular-nums text-neutral-500">
                {selectedModel.width} × {selectedModel.height} px
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {brandModels.map((model) => {
                const active = model.id === selectedModel.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleSelectModel(model.id)}
                    className={`transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'font-semibold text-neutral-950'
                        : 'text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    {model.name}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Column: Balanced Smartphone Preview */}
        <section className="flex items-center justify-center">
          <div
            style={{
              width: `${totalFrameWidth * frameScale}px`,
              height: `${totalFrameHeight * frameScale}px`,
            }}
            className="relative flex items-center justify-center"
          >
            <div
              style={{
                width: `${totalFrameWidth}px`,
                height: `${totalFrameHeight}px`,
                transform: `scale(${frameScale})`,
                transformOrigin: 'center center',
                borderRadius: selectedModel.frameRadius,
                backgroundColor: selectedModel.frameColor,
              }}
              className="relative p-[12px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.28)] ring-1 ring-black/15"
            >
              <div
                aria-hidden="true"
                className="absolute top-[110px] -left-[3px] h-7 w-[3px] rounded-l bg-neutral-700"
              />
              <div
                aria-hidden="true"
                className="absolute top-[156px] -left-[3px] h-12 w-[3px] rounded-l bg-neutral-700"
              />
              <div
                aria-hidden="true"
                className="absolute top-[214px] -left-[3px] h-12 w-[3px] rounded-l bg-neutral-700"
              />
              <div
                aria-hidden="true"
                className="absolute top-[168px] -right-[3px] h-16 w-[3px] rounded-r bg-neutral-700"
              />

              <div
                style={{
                  width: `${selectedModel.width}px`,
                  height: `${selectedModel.height}px`,
                  borderRadius: selectedModel.screenRadius,
                }}
                className="overflow-hidden bg-[#F5F5F7] ring-1 ring-black/20"
              >
                <SmartphoneScreenContent
                  model={selectedModel}
                  detectionSource={detectionSource}
                  isManualSelection={isManualSelection}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  notificationsEnabled={notificationsEnabled}
                  setNotificationsEnabled={setNotificationsEnabled}
                  showHardwareOverlay={true}
                  isRealMobile={false}
                  onBackToSite={onBackToSite}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
