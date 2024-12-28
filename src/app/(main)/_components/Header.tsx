import Image from 'next/image';

export default function Footer() {
  return (
    <div className="flex w-full flex-row justify-between bg-zinc-700 p-5 text-zinc-100">
      <div className="w-full max-w-6xl">
        <Image src="/wf-logo.png" width={36} height={36} alt={'weatherflame logo'} />
      </div>
    </div>
  );
}
