'use client'

import React, { useEffect, useRef, useState } from 'react';

interface TestimoniCardProps {
  imageSrc: string;
  altText: string;
  name: string;
  title: string;
  description: string;
  quote: string;
}

const TestimoniCardComponent: React.FC<TestimoniCardProps> = ({
  imageSrc,
  altText,
  name,
  title,
  description,
  quote,
}) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Return focus to trigger after close
  useEffect(() => {
    if (open && dialogRef.current) {
      // Focus modal on open
      dialogRef.current.focus();
      // Prevent body scroll while open
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
        // Return focus to open button
        openBtnRef.current?.focus();
      };
    }
  }, [open]);

  return (
    <>
      {/* Clickable card */}
      <button
        ref={openBtnRef}
        type="button"
        onClick={() => setOpen(true)}
        className="text-left bg-white box-border content-stretch flex gap-4 items-start justify-start px-3 py-3 lg:px-4 lg:py-6 relative rounded-[16px] shadow-[0px_12px_24px_0px_rgba(114,113,123,0.14)] shrink-0 w-full max-w-md mx-auto hover:shadow-[0_16px_32px_rgba(114,113,123,0.18)] transition-shadow"
        aria-haspopup="dialog"
        aria-label={`Buka testimoni ${name}`}
      >
        {/* Image Section */}
        <div className="relative shrink-0 size-[40px] lg:size-[50px]">
          <img
            className="block max-w-none size-full rounded-full object-cover"
            src={imageSrc}
            alt={altText}
          />
        </div>

        {/* Text Section */}
        <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 tracking-[-0.7px] flex-1">
          <div className="content-stretch flex flex-col gap-1 items-start justify-start leading-[normal] relative shrink-0 w-full">
            <h3 className="font-semibold relative shrink-0 text-[#121212] text-sm lg:text-lg">
              {name}
            </h3>
            <p className="font-normal relative shrink-0 text-[#535a56] text-xs lg:text-sm">
              {title}
            </p>
          </div>
          <p className="font-normal leading-[20px] lg:leading-[22px] relative shrink-0 text-[#535a56] text-xs lg:text-sm w-full line-clamp-3">
            “{quote}”
          </p>
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimoni-title"
          onClick={() => setOpen(false)} // close on backdrop click
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          {/* Dialog Panel */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="w-full max-w-2xl rounded-2xl bg-white shadow-xl outline-none"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-400">
                <div className="flex items-center gap-3">
                  <img
                    src={imageSrc}
                    alt={altText}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 id="testimoni-title" className="text-base lg:text-lg font-semibold text-[#121212]">
                      {name}
                    </h2>
                    <p className="text-xs lg:text-sm text-[#535a56]">{title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-[#121212] hover:bg-gray-100 active:bg-gray-200"
                  aria-label="Tutup modal"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <blockquote className="text-[#121212] text-base leading-7 lg:text-lg lg:leading-8">
                  “{quote}”
                </blockquote>
              </div>

              {/* Footer */}
              <div className="p-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md bg-green-c px-4 py-2 text-white text-sm font-semibold hover:opacity-90 active:opacity-80"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestimoniCardComponent;
