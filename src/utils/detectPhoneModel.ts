import {DEFAULT_PHONE_MODEL_ID} from '../data/phoneModels';

export type DetectionSource = 'exact-model' | 'screen-size' | 'fallback';

export interface PhoneDetectionResult {
  modelId: string;
  source: DetectionSource;
}

interface NavigatorUAData {
  model?: string;
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{model?: string; platform?: string}>;
}

function matchSamsungUltraModel(rawText: string): string | null {
  const normalized = rawText.toUpperCase();
  if (normalized.includes('SM-S948') || normalized.includes('GALAXY S26 ULTRA')) {
    return 'galaxy-s26-ultra';
  }
  if (normalized.includes('SM-S938') || normalized.includes('GALAXY S25 ULTRA')) {
    return 'galaxy-s25-ultra';
  }
  if (normalized.includes('SM-S928') || normalized.includes('GALAXY S24 ULTRA')) {
    return 'galaxy-s24-ultra';
  }
  if (normalized.includes('SM-S918') || normalized.includes('GALAXY S23 ULTRA')) {
    return 'galaxy-s23-ultra';
  }
  return null;
}

function matchIphoneByScreen(): string | null {
  const shortEdge = Math.min(window.screen.width, window.screen.height);
  const longEdge = Math.max(window.screen.width, window.screen.height);
  const dpr = window.devicePixelRatio || 1;

  if (dpr < 2.5) return null;

  if (shortEdge === 402 && longEdge === 874) {
    return 'iphone-17-pro';
  }
  if (shortEdge === 393 && longEdge === 852) {
    return 'iphone-16';
  }
  if (shortEdge === 390 && longEdge === 844) {
    return 'iphone-14';
  }

  return null;
}

export async function detectPhoneModel(): Promise<PhoneDetectionResult> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {modelId: DEFAULT_PHONE_MODEL_ID, source: 'fallback'};
  }

  const ua = navigator.userAgent || '';

  // 1. Check User-Agent string directly for Galaxy S Ultra model codes
  const uaMatch = matchSamsungUltraModel(ua);
  if (uaMatch) {
    return {modelId: uaMatch, source: 'exact-model'};
  }

  // 2. Check Chromium User-Agent Client Hints API (modern Android browsers)
  const navWithUAData = navigator as Navigator & {userAgentData?: NavigatorUAData};
  if (navWithUAData.userAgentData?.getHighEntropyValues) {
    try {
      const hints = await navWithUAData.userAgentData.getHighEntropyValues(['model', 'platform']);
      const hintModel = hints.model || '';
      const hintMatch = matchSamsungUltraModel(hintModel);
      if (hintMatch) {
        return {modelId: hintMatch, source: 'exact-model'};
      }
    } catch {
      // Client Hints unavailable or blocked; continue to fallback checks
    }
  }

  // 3. Check iPhone via iOS UA + exact screen dimensions
  if (/iPhone/i.test(ua)) {
    const iphoneMatch = matchIphoneByScreen();
    if (iphoneMatch) {
      return {modelId: iphoneMatch, source: 'screen-size'};
    }
  }

  // 4. Unrecognized device or desktop: apply default (iPhone 17 Pro)
  return {modelId: DEFAULT_PHONE_MODEL_ID, source: 'fallback'};
}
