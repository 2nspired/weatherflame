import React, { type ReactNode } from 'react';

const SectionContainer = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center px-3 landscape:px-12 ${className}`}
    >
      <div className="size-full max-w-6xl border-x border-black">{children}</div>
    </div>
  );
};

export default SectionContainer;
