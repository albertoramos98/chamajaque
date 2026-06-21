"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Clock, 
  Heart, 
  Users,
  ArrowRight
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#FFF9F9] pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-5">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
                <Heart className="w-4 h-4 fill-primary" />
                <span>O cuidado que sua casa merece</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
                Seu lar impecável, com <span className="text-primary">alma e respeito.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                Conectamos você às melhores profissionais domésticas com segurança, 
                preço justo e total dignidade para quem trabalha.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/request">
                  <Button size="lg" className="bg-primary hover:opacity-90 text-white text-lg h-16 px-10 rounded-full shadow-2xl shadow-primary/20 w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                    Solicitar Profissional
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-slate-200 text-slate-700 hover:bg-white text-lg h-16 px-10 rounded-full w-full sm:w-auto shadow-sm">
                    Quero trabalhar
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-8 border-t border-slate-200">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <Star className="w-4 h-4 fill-primary" /> 4.9/5
                  </div>
                  <p className="text-slate-500 font-medium">+5.000 limpezas realizadas</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative animate-in fade-in duration-700 zoom-in-95 delay-150">
              <div className="relative w-full aspect-[4/5] max-w-[480px] mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] -rotate-6"></div>
                <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[12px] border-white">
                  <img 
                    src="https://img.freepik.com/fotos-premium/sorrindo-jovem-faxineira-vestindo-bandana-uniforme-e-luvas-de-borracha-mantendo-os-bracos-cruzados-olhando-para-a-camera-isolada-em-fundo-azul_141793-139826.jpg" 
                    alt="Profissional sorrindo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900">Jaque selecionada!</p>
                        <p className="text-sm text-slate-500 italic">"Pronta para deixar seu lar brilhando."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="container mx-auto px-4 py-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">O jeito moderno de cuidar da casa</h2>
          <p className="text-slate-500 text-xl leading-relaxed">Combinamos tecnologia de ponta com o calor humano brasileiro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            {
              icon: <Clock className="w-10 h-10 text-primary" />,
              title: "Peça em segundos",
              desc: "Informe o que precisa e receba o valor exato na hora. Sem orçamentos demorados."
            },
            {
              icon: <ShieldCheck className="w-10 h-10 text-primary" />,
              title: "Segurança Certificada",
              desc: "Verificação rigorosa de antecedentes e treinamentos constantes para sua tranquilidade."
            },
            {
              icon: <CheckCircle2 className="w-10 h-10 text-primary" />,
              title: "Pagamento Digital",
              desc: "Pague com PIX ou Cartão pelo app. Transparência total para você e para a profissional."
            }
          ].map((step, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="group flex flex-col items-start space-y-6"
            >
              <div className="bg-slate-50 p-6 rounded-3xl group-hover:bg-primary/5 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits / Social Proof */}
      <section className="relative bg-slate-950 py-20 sm:py-32 text-white overflow-hidden rounded-3xl sm:rounded-[4rem] mx-4 border border-slate-900 shadow-2xl">
        {/* Glowing radial accents */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8 sm:space-y-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Respeito e Valorização <br/>
                <span className="text-primary italic font-serif">é o nosso DNA.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { text: "Algoritmo de preço justo baseado em esforço real", desc: "Calculamos o valor ideal considerando a metragem do imóvel, tipo de limpeza e esforço real." },
                  { text: "Termos de serviço claros que protegem a profissional", desc: "Nossos termos garantem segurança jurídica e limites bem definidos para o trabalho doméstico." },
                  { text: "Pagamento depositado integralmente e sem atrasos", desc: "Todo o dinheiro do serviço vai direto para quem trabalha, sem intermediários retendo comissões abusivas." },
                  { text: "Comunidade focada em dignidade doméstica", desc: "Um ecossistema que valoriza as diaristas e promove respeito mútuo de igual para igual." }
                ].map((item, i) => (
                  <div key={i} className="group/item flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300">
                    <div className="bg-primary/20 p-2 rounded-xl text-primary shrink-0 group-hover/item:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover/item:text-primary transition-colors">{item.text}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="inline-block">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-none h-14 px-8 rounded-full font-bold text-base shadow-xl shadow-primary/20 hover:shadow-primary/45 transition-all hover:scale-[1.02] active:scale-95 group/btn">
                  Começar agora <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              {/* Background decorative glow directly behind the stats */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-[3rem] blur-2xl pointer-events-none"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 relative z-10">
                {[
                  { val: "98%", label: "Satisfação dos clientes", desc: "Avaliação média baseada em feedbacks reais pós-faxina." },
                  { val: "+2k", label: "Profissionais parceiras", desc: "Diaristas ativas e verificadas em nossa plataforma." },
                  { val: "R$ 180", label: "Ganhos médios p/ dia", desc: "Remuneração justa que valoriza o esforço real diário." },
                  { val: "24/7", label: "Suporte humanizado", desc: "Time dedicado para ajudar tanto clientes quanto profissionais." }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className={`bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] shadow-2xl hover:border-primary/40 hover:bg-white/[0.06] transition-all duration-300 group/card ${i % 2 !== 0 ? 'sm:mt-10' : ''}`}
                  >
                    <p className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-primary to-orange-400 bg-clip-text text-transparent mb-2 group-hover/card:scale-105 transition-transform origin-left duration-300">{stat.val}</p>
                    <p className="text-slate-200 text-base font-bold mb-1">{stat.label}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4">
        <div className="bg-[#FFF9F9] border-2 border-primary/10 rounded-3xl sm:rounded-[4rem] p-8 sm:p-16 md:p-28 text-center space-y-6 sm:space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 relative z-10 max-w-4xl mx-auto leading-tight">
            Pronto para sentir sua casa <span className="text-primary">renovada?</span>
          </h2>
          <p className="text-base sm:text-2xl text-slate-500 relative z-10 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de lares brasileiros que já descobriram o poder de uma casa cuidada com carinho.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 relative z-10">
            <Link href="/request" className="w-full sm:w-auto">
              <Button size="lg" className="bg-primary text-white hover:opacity-90 text-lg sm:text-xl h-16 sm:h-20 px-8 sm:px-14 rounded-full font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105 w-full sm:w-auto">
                Agendar Faxina Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
