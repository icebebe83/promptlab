"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryData, GalleryItem } from '@/data/galleryData';

const platforms = [
  { id: 'all', label: '전체' },
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'nanobanana', label: 'Nanobanana' }
];

const platformColors: Record<string, string> = {
  midjourney: "bg-blue-900/80 text-blue-200 border-blue-500/50",
  nanobanana: "bg-yellow-900/80 text-yellow-200 border-yellow-500/50"
};

export default function PromptGalleryClient() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = activeFilter === 'all'
    ? galleryData
    : galleryData.filter(item => item.platform === activeFilter);

  return (
    <div className="w-full">
      {/* 필터 탭 */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {platforms.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeFilter === tab.id
                ? 'bg-brand-yellow text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry 그리드 + framer-motion */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {mounted && filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index * 0.02,
                ease: "easeOut"
              }}
              onClick={() => router.push(`/lab`)}
              className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-slate-800 border-2 border-transparent cursor-pointer hover:border-brand-yellow/50 transition-colors"
            >
              {/* 이미지 */}
              <div
                style={{
                  paddingBottom: item.aspectRatio === 'square' ? '100%' : item.aspectRatio === 'portrait' ? '133.33%' : '75%'
                }}
                className="relative w-full bg-slate-900"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title || "AI 생성 이미지"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && (
        <div className="py-20 text-center text-slate-500 font-medium">
          이 필터에 해당하는 이미지가 없습니다.
        </div>
      )}
    </div>
  );
}
