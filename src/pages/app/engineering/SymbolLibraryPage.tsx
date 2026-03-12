import React from 'react';
import { PidSymbolPalette, CATEGORIES, TOTAL_SYMBOLS } from '@/components/pid';

// ── Summary card data ───────────────────────────────────────────────────────
const SUMMARY_CARDS = [
  { label: 'Total Symbols', value: String(TOTAL_SYMBOLS), accent: 'text-cyan-400' },
  { label: 'Categories', value: String(CATEGORIES.length), accent: 'text-emerald-400' },
  { label: 'Standards', value: 'ISA 5.1', accent: 'text-amber-400' },
  { label: 'State Support', value: '6 states', accent: 'text-violet-400' },
];

const SymbolLibraryPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100">
          P&amp;ID Symbol Library
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          ISA 5.1 Standard Industrial Process Symbols &mdash; {TOTAL_SYMBOLS}+ components
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {SUMMARY_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3"
            >
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className={`text-xl font-bold mt-0.5 ${card.accent}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Palette ───────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        <PidSymbolPalette />
      </div>
    </div>
  );
};

export default SymbolLibraryPage;
