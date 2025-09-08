export default function TailwindDiagnostics() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Tailwind Diagnostics</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-primary text-white flex items-center justify-center rounded">primary</div>
        <div className="h-16 bg-accent text-black flex items-center justify-center rounded">accent</div>
      </div>
      <p className="prose max-w-none">
        If these boxes are colored and this paragraph has nice <strong>prose</strong> styling,
        Tailwind is loaded.
      </p>
    </main>
  );
}
