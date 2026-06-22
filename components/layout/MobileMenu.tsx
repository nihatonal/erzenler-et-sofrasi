'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { type Locale } from '@/i18n';

type NavItem = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  locale: Locale;
};

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  locale,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-dark-bg text-white lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,151,63,0.20),transparent_35%),linear-gradient(135deg,rgba(15,13,9,0.98),rgba(31,26,19,0.98))]"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          <motion.div
            className="relative z-10 flex h-full flex-col"
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            exit={{ y: 18 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="flex h-24 items-center justify-between px-6">
              <Link href={`/${locale}`} onClick={onClose}>
                <div className="text-center leading-none">
                  <div className="font-display text-3xl tracking-[0.18em]">
                    MIRA
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.35em] text-white/70">
                    BISTRO
                  </div>
                </div>
              </Link>

              <motion.button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur"
                aria-label="Close menu"
                whileTap={{ scale: 0.92 }}
                whileHover={{ rotate: 90 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <nav className="flex flex-col px-6 pt-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.06,
                    ease: 'easeOut',
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center justify-between border-b border-white/10 py-5 text-lg font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:text-brand-gold"
                  >
                    <span>{item.label}</span>
                    <span className="h-px w-8 bg-brand-gold/0 transition group-hover:bg-brand-gold" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mt-auto px-6 pb-10"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.35 }}
            >
              <div className="mb-6 h-px w-full bg-white/10" />
              <LanguageSwitcher currentLocale={locale} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}