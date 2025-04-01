'use client';

import SectionContainer from './SectionContainer';

export default function SassySeparator() {
  const randomIndex = Math.floor(Math.random() * 10);

  const sayings = [
    { line1: 'Short-term drama up top.', line2: 'long-term speculation below.' },
    { line1: 'Hourly for the impatient', line2: 'Weekly for the planners.' },
    {
      line1: 'If the next hour isn’t looking good,',
      line2: 'check below for some hope.',
    },
    { line1: 'Because predicting the future is hard enough without weather.' },
    { line1: 'Up there: weather gossip.', line2: 'Down below: weather novels.' },
    { line1: 'Hourly: the TikTok of weather.', line2: 'Weekly: the Netflix binge.' },
    {
      line1: 'For those living in the moment up top.',
      line2: 'For dreamers, check below.',
    },
    { line1: 'Hourly forecast: reality.', line2: 'Weekly forecast: optimism.' },
    {
      line1: 'One’s for now, one’s for later.',
      line2: 'Either way, bring a jacket just in case.',
    },
    { line1: 'Hourly: the tea', line2: 'Weekly: the prophecy.' },
  ];

  const randomSaying = sayings[randomIndex];

  return (
    <SectionContainer className="border-t border-black bg-zinc-200 text-black lg:bg-transparent">
      <div className="flex flex-col items-center justify-center bg-zinc-200 py-6 text-center font-mono">
        <div className="flex w-full flex-col items-center justify-center space-y-2 border-y border-black bg-zinc-100 py-3">
          <div>{randomSaying?.line1}</div>
          <div>{randomSaying?.line2}</div>
        </div>
      </div>
    </SectionContainer>
  );
}
