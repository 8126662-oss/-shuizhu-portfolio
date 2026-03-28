'use client';

import { useEffect } from 'react';

/**
 * Client boundary for layer-stack / gallery motion (local vs GitHub Pages).
 * Static pages use the same behavior via vanilla IIFE; this module is for Next-aware tooling and future App Router migration.
 */
export default function LayerShowcaseAnimations() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
  }, []);
  return null;
}
