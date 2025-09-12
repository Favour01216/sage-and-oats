export default function TailwindDiagnostics() {
  return (
    <main className="space-y-4 p-6">
      <h1 className="text-3xl font-semibold">Tailwind Diagnostics</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex h-16 items-center justify-center rounded bg-primary text-white">
          primary
        </div>
        <div className="flex h-16 items-center justify-center rounded bg-accent text-black">
          accent
        </div>
      </div>
      <p className="prose max-w-none">
        If these boxes are colored and this paragraph has nice <strong>prose</strong> styling,
        Tailwind is loaded.
      </p>
    </main>
  );
}
