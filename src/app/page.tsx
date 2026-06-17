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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
                <Heart className="w-4 h-4 fill-primary" />
                <span>O cuidado que sua casa merece</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
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
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative"
            >
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
            </motion.div>
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
      <section className="bg-slate-900 py-32 text-white overflow-hidden rounded-[4rem] mx-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                Respeito e Valorização <br/>
                <span className="text-primary italic">é o nosso DNA.</span>
              </h2>
              <div className="space-y-8">
                {[
                  "Algoritmo de preço justo baseado em esforço real",
                  "Termos de serviço claros que protegem a profissional",
                  "Pagamento depositado integralmente e sem atrasos",
                  "Comunidade focada em dignidade doméstica"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="bg-primary p-1 rounded-full shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl text-slate-300 font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-primary hover:opacity-90 border-none h-16 px-10 rounded-full font-bold text-lg">
                Começar agora <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
            
            <div className="relative">
               <div className="grid grid-cols-2 gap-8">
                 {[
                   { val: "98%", label: "Satisfação dos clientes" },
                   { val: "+2k", label: "Profissionais parceiras" },
                   { val: "R$ 180", label: "Ganhos médio p/ dia" },
                   { val: "24/7", label: "Suporte humanizado" }
                 ].map((stat, i) => (
                   <div key={i} className={`bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 ${i % 2 !== 0 ? 'mt-12' : ''}`}>
                     <p className="text-5xl font-bold text-primary mb-3">{stat.val}</p>
                     <p className="text-slate-400 text-lg font-medium">{stat.label}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4">
        <div className="bg-[#FFF9F9] border-2 border-primary/10 rounded-[4rem] p-16 md:p-28 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 relative z-10 max-w-4xl mx-auto leading-tight">
            Pronto para sentir sua casa <span className="text-primary">renovada?</span>
          </h2>
          <p className="text-2xl text-slate-500 relative z-10 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de lares brasileiros que já descobriram o poder de uma casa cuidada com carinho.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <Link href="/request">
              <Button size="lg" className="bg-primary text-white hover:opacity-90 text-xl h-20 px-14 rounded-full font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105">
                Agendar Faxina Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
