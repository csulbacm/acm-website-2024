"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import { absoluteUrl } from '../../../lib/seo';

export default function EventDetail() {
  const params = useParams();
  const { slug } = params || {};
  const [evt, setEvt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/events');
        const events = await res.json();
        const match = (events || []).find(e => String(e.slug || e._id) === String(slug));
        setEvt(match || null);
      } catch {
        setEvt(null);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading…</div>;
  if (!evt) return <div className="min-h-screen bg-white flex items-center justify-center">Event not found</div>;

  const canonical = absoluteUrl(`/events/${encodeURIComponent(evt.slug || evt._id)}`);
  const startISO = evt.startDate ? new Date(evt.startDate).toISOString() : '';
  const endISO = evt.endDate ? new Date(evt.endDate).toISOString() : startISO;
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evt.title)}&dates=${startISO.replace(/[-:]/g,'').replace(/\.\d{3}/,'')}/${endISO.replace(/[-:]/g,'').replace(/\.\d{3}/,'')}&details=${encodeURIComponent((evt.description||'').replace(/<[^>]+>/g,' '))}&location=${encodeURIComponent(evt.eventLocation||'CSULB')}`;
  const ics = `/api/generate-ics?title=${encodeURIComponent(evt.title)}&start=${encodeURIComponent(evt.startDate)}&end=${encodeURIComponent(evt.endDate||evt.startDate)}&description=${encodeURIComponent((evt.description||'').replace(/<[^>]+>/g,' '))}&location=${encodeURIComponent(evt.eventLocation||'CSULB')}`;

  return (
    <div className="min-h-screen bg-white text-black">
      <Head>
        <link rel="canonical" href={canonical} />
      </Head>

      <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
        <Image
          src={evt.image || '/images/acm-csulb.png'}
          alt={evt.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative text-white text-4xl font-bold text-center px-4">{evt.title}</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-2"><strong>Date:</strong> {new Date(evt.startDate).toLocaleString()}</p>
        {evt.endDate && <p className="text-gray-600 mb-2"><strong>Ends:</strong> {new Date(evt.endDate).toLocaleString()}</p>}
        {evt.eventLocation && <p className="text-gray-600 mb-4"><strong>Location:</strong> {evt.eventLocation}</p>}
        {evt.description && (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: evt.description }} />
        )}

        <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-3">
          <a href="/events" className="px-4 py-2 rounded bg-gray-100 text-center">Back to Events</a>
          <a href={gcal} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded bg-green-600 text-white text-center hover:bg-green-700">Add to Google Calendar</a>
          <a href={ics} className="px-4 py-2 rounded bg-blue-600 text-white text-center hover:bg-blue-700">Download .ics</a>
        </div>
      </div>
    </div>
  );
}
