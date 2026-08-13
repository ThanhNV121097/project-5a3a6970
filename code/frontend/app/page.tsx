import { ToggleTaskCompletion } from '../components/ToggleTaskCompletion';

export default function Page() {
  return (
    <main className="shell">
      <section className="hero-card" aria-labelledby="page-title">
        <p className="eyebrow">Personal task manager</p>
        <h1 id="page-title">Todo App</h1>
        <p className="lede">Add tasks, keep track of progress, and return later with your list still saved.</p>
      </section>
      <ToggleTaskCompletion />
    </main>
  );
}
