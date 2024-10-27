"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EventForm() {
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        console.error("Redirecting to login:", error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);
}