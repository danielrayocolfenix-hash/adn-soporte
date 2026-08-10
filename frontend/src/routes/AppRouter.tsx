import { Navigate, Route, Routes } from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { GuestRoute } from "@/modules/auth/components/GuestRoute";
import { ProtectedRoute } from "@/modules/auth/components/ProtectedRoute";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { ConfiguracionPage } from "@/modules/configuracion/pages/ConfiguracionPage";
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage";
import { PerfilPage } from "@/modules/perfil/pages/PerfilPage";
import { QaDetallePage } from "@/modules/qa/pages/QaDetallePage";
import { QaHistorialPage } from "@/modules/qa/pages/QaHistorialPage";
import { QaListPage } from "@/modules/qa/pages/QaListPage";
import { QaNuevaPage } from "@/modules/qa/pages/QaNuevaPage";
import { ReportesPage } from "@/modules/reportes/pages/ReportesPage";
import { TareasPage } from "@/modules/tareas/pages/TareasPage";
import { CentAyudaPage } from "@/modules/centro_ayuda/pages/centAyudapage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/qa" element={<QaListPage />} />
          <Route path="/qa/nueva" element={<QaNuevaPage />} />
          <Route path="/qa/detalle/:id" element={<QaDetallePage />} />
          <Route path="/qa/historial" element={<QaHistorialPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/tareas" element={<TareasPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/cent-ayuda" element={<CentAyudaPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
