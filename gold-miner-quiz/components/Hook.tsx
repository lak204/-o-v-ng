export default function Hook({ isDigging }: { isDigging: boolean }) {
  return (
    <img
      src="/hook.png"
      alt="hook"
      className={`w-16 absolute top-0 ${
        isDigging ? "hook-down" : "hook"
      }`}
    />
  );
}
