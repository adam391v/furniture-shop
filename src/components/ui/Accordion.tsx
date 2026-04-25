// ============================================================
// Accordion Component - Expand/Collapse cho FAQ
// Hỗ trợ mở nhiều item cùng lúc hoặc chỉ 1 item
// ============================================================

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Cho phép mở nhiều item cùng lúc (mặc định: false) */
  allowMultiple?: boolean;
}

const Accordion = ({ items, allowMultiple = false }: AccordionProps) => {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index);
        return (
          <div
            key={index}
            className={`border rounded-xl overflow-hidden transition-colors ${
              isOpen ? 'border-primary/30 bg-primary/[0.02]' : 'border-border-light bg-white'
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
              aria-expanded={isOpen}
            >
              <span
                className={`text-sm font-semibold transition-colors ${
                  isOpen ? 'text-primary' : 'text-navy group-hover:text-primary'
                }`}
              >
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-primary' : 'text-text-muted'
                }`}
              />
            </button>

            {/* Nội dung trả lời */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border-light/50 mt-0 pt-4">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
