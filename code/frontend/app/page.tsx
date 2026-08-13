export default function Page() {
  return (
    <main className="shell">
      <section className="hero-card" aria-labelledby="page-title">
        <p className="eyebrow">Personal task manager</p>
        <h1 id="page-title">Todo App</h1>
        <p className="lede">Add tasks, keep track of progress, and return later with your list still saved.</p>
      </section>
      <section className="panel" aria-labelledby="tasks-title">
        <h2 id="tasks-title">Your tasks</h2>
        <p className="muted">Task controls land here in feature stories.</p>
      </section>
    </main>
  );
}
