'use client';
import { useState, useEffect } from 'react';

export default function CurrentYear() {
  const [year, setYear] = useState(null); // Removed TypeScript-specific syntax

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span>{year}</span>;
}
