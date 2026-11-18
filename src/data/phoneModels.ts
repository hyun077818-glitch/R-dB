export type PhoneBrand = 'iphone' | 'galaxy';

export type PhoneCutout = 'dynamic-island' | 'notch' | 'punch-hole';

export interface PhoneModelSpec {
  id: string;
  brand: PhoneBrand;
  name: string;
  width: number;
  height: number;
  physicalResolution: string;
  dpr: string;
  cutout: PhoneCutout;
  frameRadius: string;
  screenRadius: string;
  frameColor: string;
  osLabel: string;
  statusTime: string;
  releaseNote: string;
}

export const PHONE_MODELS: PhoneModelSpec[] = [
  // iPhone (Default: latest iPhone 17 Pro + widely used models)
  {
    id: 'iphone-17-pro',
    brand: 'iphone',
    name: 'iPhone 17 Pro',
    width: 402,
    height: 874,
    physicalResolution: '1206 × 2622',
    dpr: '3×',
    cutout: 'dynamic-island',
    frameRadius: '54px',
    screenRadius: '44px',
    frameColor: '#1E1E20',
    osLabel: 'iOS',
    statusTime: '9:41',
    releaseNote: '최신 기본형',
  },
  {
    id: 'iphone-16',
    brand: 'iphone',
    name: 'iPhone 16',
    width: 393,
    height: 852,
    physicalResolution: '1179 × 2556',
    dpr: '3×',
    cutout: 'dynamic-island',
    frameRadius: '52px',
    screenRadius: '42px',
    frameColor: '#222225',
    osLabel: 'iOS',
    statusTime: '9:41',
    releaseNote: '표준 6.1형',
  },
  {
    id: 'iphone-15',
    brand: 'iphone',
    name: 'iPhone 15',
    width: 393,
    height: 852,
    physicalResolution: '1179 × 2556',
    dpr: '3×',
    cutout: 'dynamic-island',
    frameRadius: '52px',
    screenRadius: '42px',
    frameColor: '#262629',
    osLabel: 'iOS',
    statusTime: '9:41',
    releaseNote: '다수 사용자 보급기',
  },
  {
    id: 'iphone-14',
    brand: 'iphone',
    name: 'iPhone 14',
    width: 390,
    height: 844,
    physicalResolution: '1170 × 2532',
    dpr: '3×',
    cutout: 'notch',
    frameRadius: '50px',
    screenRadius: '40px',
    frameColor: '#242426',
    osLabel: 'iOS',
    statusTime: '9:41',
    releaseNote: '노치 표준형',
  },
  {
    id: 'iphone-13',
    brand: 'iphone',
    name: 'iPhone 13',
    width: 390,
    height: 844,
    physicalResolution: '1170 × 2532',
    dpr: '3×',
    cutout: 'notch',
    frameRadius: '50px',
    screenRadius: '40px',
    frameColor: '#242426',
    osLabel: 'iOS',
    statusTime: '9:41',
    releaseNote: '롱런 인기 모델',
  },

  // Galaxy S Ultra Series only (S26 Ultra ~ S23 Ultra)
  {
    id: 'galaxy-s26-ultra',
    brand: 'galaxy',
    name: 'Galaxy S26 Ultra',
    width: 412,
    height: 891,
    physicalResolution: '1440 × 3120',
    dpr: '3.5×',
    cutout: 'punch-hole',
    frameRadius: '28px',
    screenRadius: '21px',
    frameColor: '#1C1D1F',
    osLabel: 'One UI',
    statusTime: '12:45',
    releaseNote: '최신 S Ultra',
  },
  {
    id: 'galaxy-s25-ultra',
    brand: 'galaxy',
    name: 'Galaxy S25 Ultra',
    width: 412,
    height: 915,
    physicalResolution: '1440 × 3120',
    dpr: '3.5×',
    cutout: 'punch-hole',
    frameRadius: '26px',
    screenRadius: '19px',
    frameColor: '#212225',
    osLabel: 'One UI',
    statusTime: '12:45',
    releaseNote: 'S25 Ultra 기준',
  },
  {
    id: 'galaxy-s24-ultra',
    brand: 'galaxy',
    name: 'Galaxy S24 Ultra',
    width: 384,
    height: 832,
    physicalResolution: '1440 × 3120',
    dpr: '3.75×',
    cutout: 'punch-hole',
    frameRadius: '16px',
    screenRadius: '10px',
    frameColor: '#242528',
    osLabel: 'One UI',
    statusTime: '12:45',
    releaseNote: '플랫 각진 프레임',
  },
  {
    id: 'galaxy-s23-ultra',
    brand: 'galaxy',
    name: 'Galaxy S23 Ultra',
    width: 384,
    height: 824,
    physicalResolution: '1440 × 3088',
    dpr: '3.75×',
    cutout: 'punch-hole',
    frameRadius: '14px',
    screenRadius: '8px',
    frameColor: '#252629',
    osLabel: 'One UI',
    statusTime: '12:45',
    releaseNote: 'S23 Ultra 기준',
  },
];

export const DEFAULT_PHONE_MODEL_ID = 'iphone-17-pro';
