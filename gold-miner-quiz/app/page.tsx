export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-300 to-yellow-100 overflow-hidden relative">
      {/* Background Leaves/Decorations simulation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 text-orange-600 animate-pulse text-6xl font-bold opacity-20">🍁</div>
        <div className="absolute top-20 right-20 text-orange-500 animate-bounce text-6xl font-bold opacity-20">🍂</div>
        <div className="absolute bottom-10 left-32 text-green-600 text-6xl font-bold opacity-20">🌻</div>
      </div>

      <h1 className="text-6xl md:text-8xl font-black text-yellow-500 drop-shadow-[4px_4px_0_#8B4513] tracking-wider mb-8 z-10 text-center">
        GOLD MINER
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold text-orange-700 mb-12 z-10 text-center uppercase">
        Educational Edition
      </h2>

      <a
        href="/content"
        className="group relative px-8 py-4 bg-yellow-400 hover:bg-yellow-300 rounded-full border-4 border-yellow-700 shadow-[0_8px_0_#8B4513] transition-all active:translate-y-2 active:shadow-none z-10"
      >
        <span className="text-2xl font-black text-amber-900 uppercase group-hover:scale-105 inline-block transition-transform">
          Play Now
        </span>
      </a>

      {/* Miner Graphic Placeholder */}
      <div className="mt-12 z-10">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-amber-800 rounded-full flex items-center justify-center border-4 border-amber-950 relative">
          <span className="text-6xl">👷</span>
        </div>
      </div>
    </div>
  );
}
