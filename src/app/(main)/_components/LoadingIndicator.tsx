'use client';

import { useEffect, useState } from 'react';

import TypewriterText from '~/app/(main)/_components/TextAnimations';

export default function LoadingIndicator() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessage('Still waiting on those weather gods... ahem, I mean government...');
    }, 5000);

    const timer2 = setTimeout(() => {
      setMessage('Hang tight – the forecast is on its way!');
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-zinc-100 px-6 py-3 font-mono text-xl text-zinc-100 md:text-2xl">
        <TypewriterText className="flex animate-pulse" text={'loading'}>
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-150">.</span>
          <span className="animate-pulse delay-300">.</span>
        </TypewriterText>
      </div>
      <div className="min-h-[108px] p-6 text-center font-mono text-sm md:text-base">
        {message}
      </div>
    </div>
  );
}
