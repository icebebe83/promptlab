import Navigation from "@/components/Navigation";
import PromptLabClient from "@/components/PromptLabClient";

export default function PromptLabPage() {
  return (
    <main className="min-h-screen pb-24 bg-slate-950">
      <Navigation />
      
      <section className="pt-32 px-6 max-w-7xl mx-auto">
        <PromptLabClient />
      </section>
    </main>
  );
}
