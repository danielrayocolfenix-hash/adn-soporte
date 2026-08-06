import { AppProviders } from "@/app/AppProviders";
import { AppRouter } from "@/routes/AppRouter";

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
