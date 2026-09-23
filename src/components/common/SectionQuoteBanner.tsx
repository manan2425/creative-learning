'use client';

import React from 'react';

export interface SectionQuoteBannerProps {
  quote?: string;
  author?: string;
}

export const SectionQuoteBanner: React.FC<SectionQuoteBannerProps> = ({
  quote = 'The future belongs to students and makers who build what they imagine with hands-on silicon.',
  author = '— Creative Learning Engineering Lab',
}) => {
  return (
    <section className="w-full bg-slate-50/50 py-5 sm:py-6 px-4 sm:px-6 lg:px-8 border-b border-border/70">
      <div className="max-w-4xl mx-auto">
        {/* Exact Quote Card Effect as under the Hero Logo */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-border/80 text-left relative overflow-hidden shadow-2xs">
          {/* Watermark Quote Mark */}
          <div className="text-3xl sm:text-4xl text-primary/20 font-serif font-black absolute top-1 sm:top-2 right-3 sm:right-4 select-none leading-none">
            &ldquo;
          </div>
          
          {/* Quote Text */}
          <p className="text-xs sm:text-sm md:text-[14px] italic text-slate-700 font-sans leading-relaxed relative z-10 pr-6">
            {quote}
          </p>

          {/* Author Signature */}
          <small className="text-[11px] sm:text-xs font-mono font-bold text-primary mt-2 block">
            {author.startsWith('—') ? author : `— ${author}`}
          </small>
        </div>
      </div>
    </section>
  );
};

