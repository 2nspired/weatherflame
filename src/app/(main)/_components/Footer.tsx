import GitHubIcon from '~/app/(main)/_components/GitHubIcon';

export default function Footer() {
  return (
    <div className="flex w-full justify-center bg-zinc-700 p-6 pb-3 text-sm text-zinc-100">
      <div className="flex w-full max-w-6xl justify-between font-mono">
        <div>© weatherflame 2025</div>
        <div>
          <a
            href="https://github.com/2nspired/weatherflame"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon fill="#f4f4f5" />
          </a>
        </div>
      </div>
    </div>
  );
}
