export default function Header() {
  return (
    <header className="border-b border-slate-950 bg-slate-400 p-4 transition-colors duration-500 ease-in-out hover:bg-slate-950 hover:text-white">
      {/* <div className=" border-2 border-slate-500">Header</div> */}
      <nav className="flex justify-between">
        <div>
          <h1>Logo</h1>
        </div>
        <ul>
          <li>About</li>
        </ul>
      </nav>
    </header>
  );
}
