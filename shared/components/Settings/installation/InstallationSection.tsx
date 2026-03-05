"use client";

import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";
import { Check, Copy, Code2, Terminal, Activity, Zap } from "lucide-react";
import { useState } from "react";

export default function InstallationSection() {
  const { selectedProjectId } = useSelectedProjectStore();
  const [copied, setCopied] = useState<string | null>(null);

  // Intentamos obtener la URL de las env, o usamos la provista por el usuario
  const gardenUrl = process.env.NEXT_PUBLIC_GARDEN_ADS_URL || "https://s02-26-equipo-03-web-app-developmen-green.vercel.app";
  const apiKey = selectedProjectId || "bad3325b623b13d201cebd8a5a440c32381bf76ff72858dc46b9da7346a4614f";

  const pixelScript = `<!-- Embebido de GardenAds -->
<script>
  (function(w,d,s,u,k){
    var gardenUrl = '${gardenUrl}';
    var apiKey = '${apiKey}';
    var expiryDays = 7;

    // 1. Captura inmediata de parámetros (Atribución)
    try {
      var urlParams = new URLSearchParams(w.location.search);
      var attrData = {};
      var params = ['fclip', 'gclip', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
      var hasData = false;
      params.forEach(function(p) {
        var val = urlParams.get(p);
        if (val) { attrData[p] = val; hasData = true; }
      });
      if (hasData) {
        var expiry = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
        var payload = JSON.stringify({ params: attrData, expiry: expiry });
        localStorage.setItem('_ga_attribution', payload);
      }

      // --- Inyección Automática ---
      function inject() {
        var forms = d.querySelectorAll('form');
        var visitorId = localStorage.getItem('_a_vid') || '';
        var storedAttr = localStorage.getItem('_ga_attribution') || '';
        
        forms.forEach(function(f) {
          // 1. Atribución
          if (storedAttr) {
            var attrInput = f.querySelector('input[name="attributionData"]');
            if (!attrInput) {
              attrInput = d.createElement('input');
              attrInput.type = 'hidden'; attrInput.name = 'attributionData';
              f.appendChild(attrInput);
            }
            attrInput.value = storedAttr;
          }

          // 2. ID de Visitante (external_session_id)
          var vidInput = f.querySelector('input[name="externalClientId"]');
          if (!vidInput) {
            vidInput = d.createElement('input');
            vidInput.type = 'hidden'; vidInput.name = 'externalClientId';
            f.appendChild(vidInput);
          }
          if (visitorId) {
            vidInput.value = visitorId;
          }

          // 3. Project ID
          var projInput = f.querySelector('input[name="projectId"]');
          if (!projInput) {
            projInput = d.createElement('input');
            projInput.type = 'hidden'; projInput.name = 'projectId';
            f.appendChild(projInput);
          }
          projInput.value = apiKey;
        });
      }
      
      inject();
      var injectInterval = setInterval(inject, 500);
      setTimeout(function() { clearInterval(injectInterval); setInterval(inject, 3000); }, 10000);
    } catch(e) {}

    // 2. Cargador del Pixel de GardenAds (Reporte)
    w['_aq']=w['_aq']||[];
    w['_ak']=apiKey;
    w['_au']=gardenUrl;
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s);
    j.async=true;
    j.src=gardenUrl+'/pixel.js';
    f.parentNode.insertBefore(j,f);
  })(window,document,'script');
</script>`;

  const serverSnippet = `// 1. Captura los datos inyectados automáticamente
const formData = await request.formData();
const attributionData = formData.get("attributionData");
const externalClientId = formData.get("externalClientId");
const projectId = formData.get("projectId");

// 2. Pásalo a Stripe (Esencial para el ROI en GardenAds)
const session = await stripe.checkout.sessions.create({
  // ... campos estándar ...
  payment_intent_data: {
    metadata: {
      attribution: attributionData,
      project_id: projectId,
      external_session_id: externalClientId,
    },
  },
  metadata: {
    attribution: attributionData,
    project_id: projectId,
    external_session_id: externalClientId,
  },
});`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl py-4 pb-12 mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Guía de Integración: GardenAds + Stripe</h2>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
          Sigue estos pasos para que GardenAds pueda rastrear tus conversiones y atribuirlas a tus anuncios de Facebook y Google Ads correctamente.
        </p>
      </div>

      {/* STEP 1: PIXEL */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600 font-bold text-sm ring-1 ring-emerald-200">1</div>
          <h3 className="font-bold text-lg text-gray-800">El Pixel (Captura Frontend)</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Coloca este script en el <strong>{"<head>"}</strong> de tu sitio web para capturar IDs de anuncios e inyectar datos de atribución en tus formularios automáticamente.
        </p>
        <div className="relative group rounded-3xl bg-[#0F172A] p-6 shadow-2xl border border-white/5 overflow-hidden transition-all hover:bg-[#111A30]">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
             <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono tracking-widest uppercase">
                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>layout.tsx / index.html</span>
             </div>
             <button 
                onClick={() => copyToClipboard(pixelScript, 'pixel')}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-600 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                {copied === 'pixel' ? (
                  <><Check className="h-3.5 w-3.5" /> Copiado</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copiar Código</>
                )}
              </button>
          </div>
          <div className="custom-scrollbar overflow-x-auto max-h-[500px]">
            <pre className="text-emerald-400/90 font-mono text-[11px] leading-relaxed">
              <code>{pixelScript}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* STEP 2: SERVER SIDE */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600 font-bold text-sm ring-1 ring-emerald-200">2</div>
          <h3 className="font-bold text-lg text-gray-800">Persistencia en Stripe (Server-side)</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          En tu servidor, captura los campos inyectados por el script y pásalos como <strong>metadata</strong> a Stripe. Esto es crucial para que los webhooks funcionen.
        </p>
        <div className="relative group rounded-3xl bg-[#0F172A] p-6 shadow-2xl border border-white/5 overflow-hidden transition-all hover:bg-[#111A30]">
           <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
             <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono tracking-widest uppercase">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span>checkout/route.js</span>
             </div>
             <button 
                onClick={() => copyToClipboard(serverSnippet, 'server')}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-600 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                {copied === 'server' ? (
                  <><Check className="h-3.5 w-3.5" /> Copiado</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copiar Código</>
                )}
              </button>
          </div>
          <div className="custom-scrollbar overflow-x-auto">
            <pre className="text-blue-300 font-mono text-[11px] leading-relaxed">
              <code>{serverSnippet}</code>
            </pre>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STEP 3: WEBHOOKS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600 font-bold text-sm ring-1 ring-emerald-200">3</div>
            <h3 className="font-bold text-lg text-gray-800">Stripe Webhooks</h3>
          </div>
          <div className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm flex flex-col gap-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Configura un Webhook en <strong>Stripe {" > "} Developers</strong> para cerrar el círculo.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-400">Endpoint URL</span>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 group transition-all hover:border-emerald-200">
                  <code className="text-xs text-emerald-700 font-bold break-all flex-1">
                    {gardenUrl}/api/webhook/stripe
                  </code>
                  <button onClick={() => copyToClipboard(`${gardenUrl}/api/webhook/stripe`, 'url')} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                     {copied === 'url' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-blue-50/30 p-4 rounded-2xl border border-blue-100">
                <Zap className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700 leading-relaxed">
                  Escucha el evento: <br /><strong className="font-bold">checkout.session.completed</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VERIFICATION */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-emerald-500" />
            <h3 className="font-bold text-lg text-gray-800">Verificación</h3>
          </div>
          <div className="rounded-3xl bg-emerald-500 p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
            <h4 className="font-bold text-lg mb-2">Estado del Tracking</h4>
            <p className="text-xs text-emerald-50/80 leading-relaxed mb-6">
              Una vez instalado, el sistema detectará automáticamente cuando se complete una venta.
            </p>
            <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-xl border border-white/20 text-[10px] font-bold uppercase tracking-wider">
               <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
               Esperando primer evento...
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
