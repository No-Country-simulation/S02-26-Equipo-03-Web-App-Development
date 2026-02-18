import { FaLinkedinIn, FaTwitter } from "react-icons/fa";

const footerLinks = {
  PRODUCT: ["Features", "Tracking Health", "Integrations", "API"],
  COMPANY: ["About", "Security", "Pricing", "Support"],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <span className="font-black text-gray-900 text-xl">GardenAds</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-[200px]">
            La capa de verdad definitiva para ecommerce que escalan con revenue
            real.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-blue-100 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors duration-150"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={14} />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-blue-100 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors duration-150"
              aria-label="Twitter"
            >
              <FaTwitter size={14} />
            </a>
          </div>
        </div>

        {/* Product & Company links */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-4">
              {category}
            </h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-4">
            CONTACT
          </h4>
          <p className="text-sm text-gray-500 mb-1">support@gardenads.com</p>
          <p className="text-sm font-semibold text-gray-800">
            Sales: +1 (555) 000-0000
          </p>
        </div>
      </div>
    </footer>
  );
}