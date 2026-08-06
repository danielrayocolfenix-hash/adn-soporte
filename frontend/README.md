# ADN-Soporte — Frontend

SPA del módulo de soporte técnico/QA de ADN-VORTEX. React 19 + TypeScript +
Vite, arquitectura modular: cada dominio de negocio vive en `src/modules/`
con sus propias páginas, componentes, servicios, hooks y validaciones.

## Arquitectura

```
src/
  app/            App raíz + providers (React Query, Router, Toasts)
  routes/         Definición de rutas (AppRouter)
  layouts/        MainLayout (autenticado), AuthLayout (login)
  modules/
    auth/ qa/ dashboard/ reportes/ configuracion/ perfil/
      pages/ components/ services/ hooks/ validations/ types/
  shared/
    components/   Componentes reutilizables (base shadcn/ui)
    hooks/ services/ (apiClient con Axios + interceptor JWT) utils/
  styles/         Tailwind CSS
  config/         Variables de entorno, setup de tests
```

El frontend consume únicamente la API REST del backend — nunca accede a la
base de datos directamente. Cada módulo tiene hoy una página placeholder;
la lógica de negocio se añade módulo por módulo sin reestructurar nada.

## Stack

Vite, React 19, TypeScript, React Router, Axios, TanStack Query, React Hook
Form + Zod, TailwindCSS (+ base para shadcn/ui), Recharts, React Toastify,
Zustand, ESLint + Prettier, Vitest + Testing Library, Husky + lint-staged +
commitlint.

## Puesta en marcha

```bash
npm install
copy .env.example .env      # ajustar VITE_API_URL si el backend no corre en :8000
npm run dev
```

## Scripts

```bash
npm run dev            # servidor de desarrollo
npm run build           # type-check + build de producción
npm run lint             # ESLint
npm run format           # Prettier (escribe)
npm run test             # Vitest
npm run prepare          # instala los git hooks de Husky (requiere repo git)
```

## Variables de entorno

Ver `.env.example`. Nunca commitear `.env`.
