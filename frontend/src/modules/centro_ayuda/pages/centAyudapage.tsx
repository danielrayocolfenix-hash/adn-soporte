import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  ChevronDown,
  Bug,
  ShieldCheck,
  Layout,
  HelpCircle,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

import { FAQS_MOCK_DATA } from "@/modules/centro_ayuda/services/centroAyudaMockData";

export function CentAyudaPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("1");

  // Filtrado dinámico de FAQs
  const filteredFaqs = FAQS_MOCK_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleAccordion = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-8xl pb-12">
      {/* HEADER / BANNER DE BUSQUEDA */}
      <div className="relative rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 p-8 text-center overflow-hidden shadow-md">
        <div className="absolute -top-12 -right-12 size-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 size-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <BookOpen size={14} />
            Centro de Ayuda & Documentación
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            ¿En qué podemos ayudarte hoy?
          </h1>
          <p className="text-sm text-slate-400">
            Encuentra guías rápidas, respuestas a preguntas frecuentes o contáctanos directamente.
          </p>

          {/* Buscador de Ayuda */}
          <div className="relative pt-2">
            <Search className="absolute left-4 top-5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar preguntas, guías de UI, reportes de QA..."
              className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* BOTONES NAVEGABLES DEL CENTRO DE AYUDA (CARDS CLICKABLES) */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Acceso Rápido por Módulo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Registrar Incidencia */}
          <button
            type="button"
            onClick={() => navigate("/qa/nueva")}
            className="group text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                <Bug size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Reportar Fallo o UI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Crea una nueva incidencia o discrepancia visual de diseño en la plataforma.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1 group-hover:translate-x-1 transition-transform">
              Ir a Formulario <ExternalLink size={12} />
            </div>
          </button>

          {/* Card 2: Guía de Diseño */}
          <button
            type="button"
            onClick={() => navigate("/qa")}
            className="group text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                <Layout size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Casos de Prueba QA
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Consulta el listado general de escenarios de prueba y validaciones.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1 group-hover:translate-x-1 transition-transform">
              Ver Módulo <ExternalLink size={12} />
            </div>
          </button>

          {/* Card 3: Mi Perfil & Ajustes */}
          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="group text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Ajustes de Cuenta
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Gestiona tus credenciales, notificaciones y opciones de perfil.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1 group-hover:translate-x-1 transition-transform">
              Ir a Mi Perfil <ExternalLink size={12} />
            </div>
          </button>
        </div>
      </div>

      {/* SECCIÓN DE ACORDEONES (FAQS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle size={16} /> Preguntas Frecuentes
          </h2>
          <span className="text-xs text-slate-400">Mostrando {filteredFaqs.length} resultados</span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No encontramos respuestas que coincidan con "{searchQuery}".
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg">
                        {faq.category}
                      </span>
                      <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-indigo-500" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed bg-slate-50/30 dark:bg-slate-900/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER DE CONTACTO ADICIONAL */}
      <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-indigo-950 dark:text-indigo-200">
              ¿No encontraste lo que buscabas?
            </h4>
            <p className="text-xs text-indigo-700/80 dark:text-indigo-300/70">
              Nuestro equipo de soporte técnico está disponible para asistirte.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/qa/nueva")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-indigo-600/20 shrink-0"
        >
          Contactar Soporte QA
        </button>
      </div>
    </div>
  );
}
