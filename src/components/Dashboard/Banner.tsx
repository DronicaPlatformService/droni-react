'use client';

import type React from 'react';
import { type JSX, useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface BannerProps {
  className?: string;
}

const sampleBannerImageSrc = '/samples/banner-sample.jpg';

const images = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  src: sampleBannerImageSrc,
  alt: `배너 샘플 이미지 ${i + 1}`,
}));

const BANNER_HEIGHT = '140px';
const DRAG_THRESHOLD = 50; // 드래그로 페이지를 넘기기 위한 최소 이동 거리 (px)

export function Banner({ className }: BannerProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const bannerRef = useRef<HTMLElement>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, []);

  const handleDragStart = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    setIsDragging(true);
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(currentX);
    setTranslateX(0); // 드래그 시작 시 translateX 초기화
    if (bannerRef.current) {
      bannerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleDragMove = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = currentX - startX;
    setTranslateX(diffX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (bannerRef.current) {
      bannerRef.current.style.cursor = 'grab';
    }

    if (Math.abs(translateX) > DRAG_THRESHOLD) {
      if (translateX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTranslateX(0); // 드래그 종료 후 translateX 초기화
  };

  // 자동 슬라이드
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 5000); // 5초마다 다음 이미지로
    return () => clearTimeout(timer);
  }, [currentIndex, handleNext]);

  return (
    <section
      ref={bannerRef}
      className={twMerge('relative w-full overflow-hidden bg-gray-200', className)}
      style={{ height: BANNER_HEIGHT }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd} // 컨테이너 밖으로 마우스가 나가도 드래그 종료
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? translateX : 0}px))`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="h-full w-full flex-shrink-0 object-cover"
            draggable="false" // 브라우저 기본 이미지 드래그 방지
          />
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      <nav className="absolute right-5 bottom-3 z-10">
        <div className="flex h-6 w-14 items-center justify-center gap-1 rounded-full bg-black/20 px-2 py-[3px] text-xs text-white">
          <div className="flex items-baseline">
            <span className="text-system-09 text-white">
              {(currentIndex + 1).toString().padStart(2, '0')}
            </span>
            <span className="px-1 text-gray-200">|</span>
            <span className="text-system-10 text-gray-200">
              {images.length.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </nav>
    </section>
  );
}
