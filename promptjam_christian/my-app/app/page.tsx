import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <code className="bg-black/[.05] dark:bg-white/[.06] px-5 py-5 rounded font-semibold uppercase">
        Supperteam prompt jam
      </code>
    </div>
  );
}
