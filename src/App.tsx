/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight} from 'lucide-react';
import {AppTemplate} from './components/AppTemplate';

interface SlideFrame {
  index: string;
  label: string;
  title: string;
  description: string;
}

const SLIDE_TEMPLATE_FRAMES: SlideFrame[] = [
  {
    index: '01',
    label: '슬라이드 01',
    title: '도입 및 문제 정의',
    description: '전달해 주실 발표 슬라이드 첫 장의 핵심 메시지와 시각 자료가 배치되는 영역입니다.',
  },
  {
    index: '02',
    label: '슬라이드 02',
    title: '앱 핵심 경험 설명',
    description: '앱의 주요 기능과 동작 방식을 발표 흐름에 맞춰 화면으로 설명하는 영역입니다.',
  },
  {
    index: '03',
    label: '슬라이드 03',
    title: '실제 앱 연결 및 시연',
    description: '발표 마지막에 관객이 직접 앱 화면으로 이동해 체험하도록 연결하는 영역입니다.',
  },
];

function isAppRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return (
    params.get('view') === 'app' ||
    window.location.pathname === '/app' ||
    window.location.hash === '#/app'
  );
}

export default function App() {
  const [inAppView, setInAppView] = useState<boolean>(isAppRoute);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  useEffect(() => {
    const handlePopState = () => {
      setInAppView(isAppRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const openApp = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'app');
    window.history.pushState({}, '', url.toString());
    setInAppView(true);
    window.scrollTo({top: 0});
  };

  const backToSite = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    if (url.pathname === '/app') {
      url.pathname = '/';
    }
    url.hash = '';
    window.history.pushState({}, '', url.toString());
    setInAppView(false);
    window.scrollTo({top: 0});
  };

  if (inAppView) {
    return <AppTemplate onBackToSite={backToSite} />;
  }

  const currentSlide = SLIDE_TEMPLATE_FRAMES[activeSlide];

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? SLIDE_TEMPLATE_FRAMES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === SLIDE_TEMPLATE_FRAMES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-neutral-950 antialiased">
      {/* Top Bar: 3-zone contract */}
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-[#FBF9F5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#overview"
            className="text-base font-semibold tracking-tight text-neutral-950 whitespace-nowrap shrink-0"
          >
            전시 발표
          </a>

          <nav
            aria-label="주요 섹션"
            className="hidden md:flex items-center gap-6 text-sm text-neutral-600"
          >
            <a
              href="#overview"
              className="transition-colors hover:text-neutral-950 whitespace-nowrap shrink-0"
            >
              개요
            </a>
            <a
              href="#slides"
              className="transition-colors hover:text-neutral-950 whitespace-nowrap shrink-0"
            >
              슬라이드
            </a>
            <a
              href="#guide"
              className="transition-colors hover:text-neutral-950 whitespace-nowrap shrink-0"
            >
              앱 설명
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={openApp}
              className="inline-flex items-center gap-1.5 bg-neutral-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800 whitespace-nowrap shrink-0"
            >
              <span>앱으로 이동</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero / Presentation Intro */}
        <section id="overview" className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
            <div className="max-w-3xl space-y-6">
              <p className="text-xs tracking-widest text-neutral-500">
                전시 프레젠테이션 템플릿 · 앱 연동 구조
              </p>

              <h1
                className="text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-5xl"
                style={{textWrap: 'balance'}}
              >
                발표 슬라이드와 연결되는 앱 소개 페이지
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-neutral-600">
                이 웹사이트는 전시 발표 시 슬라이드 흐름에 맞춰 앱을 소개하기 위한 기본
                템플릿입니다. 준비하신 슬라이드를 전달해 주시면 그 내용에 맞게 섹션과 시각 요소를
                채울 수 있습니다.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={openApp}
                  className="inline-flex items-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 whitespace-nowrap shrink-0"
                >
                  <span>앱 실행하기</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>

                <a
                  href="#slides"
                  className="inline-flex items-center border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-950 whitespace-nowrap shrink-0"
                >
                  슬라이드 영역 보기
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Slide Stage Frame */}
        <section id="slides" className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <p className="text-xs tracking-widest text-neutral-500">프레젠테이션 영역</p>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  슬라이드 연동 뷰어
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-serif text-lg tabular-nums text-neutral-500">
                  {currentSlide.index} / 0{SLIDE_TEMPLATE_FRAMES.length}
                </span>
                <div className="flex items-center border border-neutral-200 bg-[#FBF9F5]">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="이전 슬라이드"
                    className="p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="다음 슬라이드"
                    className="border-l border-neutral-200 p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 16:9 Presentation Frame */}
            <div className="flex aspect-video w-full flex-col justify-between border border-neutral-200 bg-[#FBF9F5] p-8 sm:p-14">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{currentSlide.label}</span>
                <span>16:9 발표 프레임</span>
              </div>

              <div className="max-w-2xl space-y-4">
                <span className="block font-serif text-4xl font-medium text-neutral-300 tabular-nums sm:text-5xl">
                  {currentSlide.index}
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                  {currentSlide.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {currentSlide.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-xs text-neutral-500">
                <span>슬라이드 이미지 또는 인터랙션 삽입 위치</span>
                <button
                  type="button"
                  onClick={openApp}
                  className="font-medium text-neutral-950 underline underline-offset-4 hover:text-neutral-600"
                >
                  앱 화면으로 전환
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* App Description Template Structure */}
        <section id="guide" className="bg-[#FBF9F5]">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <div className="mb-10 max-w-2xl space-y-2">
              <p className="text-xs tracking-widest text-neutral-500">구성 템플릿</p>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                앱 설명 섹션 구조
              </h2>
            </div>

            <div className="grid gap-px border border-neutral-200 bg-neutral-200 md:grid-cols-3">
              <article className="flex flex-col justify-between gap-6 bg-white p-8">
                <div className="space-y-3">
                  <span className="font-serif text-2xl text-neutral-400 tabular-nums">01.</span>
                  <h3 className="text-lg font-semibold text-neutral-950">기획 배경과 목표</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    프로젝트가 해결하려는 문제와 전시에서 보여주고자 하는 핵심 주제를 정리하는
                    공간입니다.
                  </p>
                </div>
                <span className="text-xs text-neutral-400">슬라이드 내용 반영 예정</span>
              </article>

              <article className="flex flex-col justify-between gap-6 bg-white p-8">
                <div className="space-y-3">
                  <span className="font-serif text-2xl text-neutral-400 tabular-nums">02.</span>
                  <h3 className="text-lg font-semibold text-neutral-950">주요 기능 및 구현</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    앱 내부의 핵심 인터페이스, 사용자 흐름, 기술적 포인트를 시각적으로 풀어내는
                    공간입니다.
                  </p>
                </div>
                <span className="text-xs text-neutral-400">슬라이드 내용 반영 예정</span>
              </article>

              <article className="flex flex-col justify-between gap-6 bg-white p-8">
                <div className="space-y-3">
                  <span className="font-serif text-2xl text-neutral-400 tabular-nums">03.</span>
                  <h3 className="text-lg font-semibold text-neutral-950">전시 체험 연결</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    관객이 웹 설명을 보고 바로 스마트폰 앱 화면으로 넘어가 체험을 이어가도록
                    연결합니다.
                  </p>
                </div>
                <span className="text-xs text-neutral-400">앱 경로 연결 완료</span>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-[#FBF9F5]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <span>전시 발표용 웹사이트 템플릿</span>
          <button
            type="button"
            onClick={openApp}
            className="text-neutral-800 underline underline-offset-4 hover:text-neutral-950"
          >
            앱 화면 바로가기
          </button>
        </div>
      </footer>
    </div>
  );
}
