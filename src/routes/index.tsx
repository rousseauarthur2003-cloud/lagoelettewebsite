import { createFileRoute } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

// Page prête à recevoir le code HTML existant du restaurant La Goélette.
function Index() {
  return (
    <main className="min-h-screen">
      {/* Le contenu HTML existant sera intégré ici. */}
    </main>
  );
}
