import Link from 'next/link';

const FOOTER_LINKS = {
  PRODUCTO: [
    { name: 'Cómo funciona', href: '#' },
    { name: 'Integraciones', href: '#' },
    { name: 'Tracking Health', href: '#' },
    { name: 'Precios', href: '#' },
    { name: 'Changelog', href: '#' },
    { name: 'Status', href: '#' },
  ],
  RECURSOS: [
    { name: 'Documentación', href: '#' },
    { name: 'API Docs', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Guías', href: '#' },
    { name: 'Help Center', href: '#' },
  ],
  EMPRESA: [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  LEGAL: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Seguridad', href: '#' },
    { name: 'GDPR', href: '#' },
    { name: 'Cookies', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#020617] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        
       
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
       
            <span className="text-3xl font-bold tracking-tight">
              Garden<span className="text-[#10b981]">Ads</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Lorem ipsum dolor sit amet consectetur. Sagittis lacinia lorem ipsum viverra massa non turpis interdum ut mi nunc est mi cras donec tortor condimentum.
          </p>
        </div>

   
        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <div key={category} className="space-y-6">
            <h4 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
              {category}
            </h4>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#10b981] hover:text-emerald-400 text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>


      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>© 2026 GardenAds Inc. Todos los derechos reservados.</p>
    
      </div>
    </footer>
  );
}