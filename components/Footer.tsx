"use client";

import Link from "next/link";
import {
  HeartIcon,
  MapPinIcon,
  MessageCircleMore,
  PhoneIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si"; // Simple Icons
import { SlSocialLinkedin } from "react-icons/sl";
import { BiEnvelope } from "react-icons/bi";
import LogoComponent from "./Logo";

export const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  const services = [
    {
      name: "Gastronomia",
      href: "/profiles?sector=gastronomia",
      description: "(Restaurantes, Cafés, Bares)",
    },
    {
      name: "Saúde e Bem-estar",
      href: "/profiles?sector=saude-e-bem-estar",
      description: "(Farmácias, Clínicas, Academias)",
    },
    {
      name: "Serviços Profissionais",
      href: "/profiles?sector=servicos-profissionais",
      description: "(Advogados, Contadores, Construção e Manutenção)",
    },
    {
      name: "Turismo e Lazer",
      href: "/profiles?sector=turismo-e-lazer",
      description: "(Pousadas, chalés, Parques, Trilhas)",
    },
  ];

  const companyLinks = [
    { name: "Sobre Nós", href: "/about" },
    { name: "Como Funciona", href: "/how-it-works" },
    { name: "Para Profissionais", href: "/professionals" },
    { name: "Central de Ajuda", href: "/help" },
    { name: "Blog", href: "/blog" },
  ];

  const legalLinks = [
    { name: "Termos de Uso", href: "/terms" },
    { name: "Política de Privacidade", href: "/privacy" },
    { name: "Política de Cookies", href: "/cookies-policy" },
    { name: "Código de Conduta", href: "/conduct" },
  ];

  const socialMedia = [
    {
      icon: <MessageCircleMore size={20} />,
      href: "https://wa.me/5548996768705",
      label: "WhatsApp",
      color: "hover:bg-green-500",
    },
    {
      icon: <SiInstagram size={20} />,
      href: "https://www.instagram.com/comercioslocais.oficial",
      label: "Instagram",
      color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500",
    },
    {
      icon: <SiFacebook size={20} />,
      href: "https://www.facebook.com/comercioslocais.oficial",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: <SlSocialLinkedin size={20} />,
      href: "https://www.linkedin.com/company/comercios-locais",
      label: "LinkedIn",
      color: "hover:bg-blue-700",
    },
  ];

  const stats = [
    {
      icon: <UsersIcon size={24} />,
      value: "Mais visibilidade",
      label: "Atraia novos clientes todos os dias",
    },
    {
      icon: <StarIcon size={24} />,
      value: "Gestão fácil",
      label: "Gerencie contatos, orçamentos e agendamentos",
    },
    {
      icon: <ShieldCheckIcon size={24} />,
      value: "Crescimento constante",
      label: "Fortalecendo a economia local e a comunidade",
    },
  ];

  return (
    <footer className="bg-[#1A1A19] text-gray-300">
      {/* Stats Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group footer-stat-item">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-[#97B067] group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-white footer-stat-number">
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 footer-section">
            <div className="flex items-center gap-3 mb-6 group footer-logo-container">
              <LogoComponent />
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              A plataforma oficial para encontrar os melhores profissionais e
              comércios de Águas Mornas.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <PhoneIcon size={16} className="text-[#97B067]" />
                <span>+55 (48) 9885 - 31990</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BiEnvelope size={16} className="text-[#97B067]" />
                <span>contato@comercioslocais.com.br</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPinIcon size={16} className="text-[#97B067]" />
                <span>Águas Mornas - SC, Brasil</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="text-white font-semibold mb-6">Nossos Serviços</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <div className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 footer-link">
                    <div>
                      <span className="font-medium">{service.name}</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href="/anunciante/onboarding"
                className="inline-flex items-center gap-2 bg-[#85A055] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-baseGreen transition-all duration-200 hover:scale-105 footer-cta-button"
              >
                <HeartIcon size={16} />
                Anuncie conosco
              </Link>
            </div>
          </div>

          {/* Company */}
          {/* <div className="footer-section">
            <h4 className="text-white font-semibold mb-6">Empresa</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 footer-link"
                  >
                    <span className="w-1 h-1 bg-[#97B067] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Legal & Social */}
          <div className="footer-section">
            {/* <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-3 mb-8">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 footer-link"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul> */}

            {/* Social Media */}
            <div>
              <h4 className="text-white font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-200 ${social.color} hover:text-white hover:scale-110 hover:shadow-lg footer-social-icon`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-400">
            © {currentYear} Comércios Locais. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
