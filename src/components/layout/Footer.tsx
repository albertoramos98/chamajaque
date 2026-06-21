import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 mb-4 block">
              Chama<span className="text-primary">Jaque</span>
            </Link>
            <p className="text-slate-600 max-w-sm">
              Conectando lares brasileiros às melhores profissionais com respeito, 
              segurança e dignidade. Valorizamos quem cuida do seu lar.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Para Clientes</h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li><Link href="/request">Encontrar Profissional</Link></li>
              <li><Link href="/#como-funciona">Como funciona</Link></li>
              <li><Link href="/#seguranca">Segurança</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Para Profissionais</h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li><Link href="/register">Trabalhar com a Jaque</Link></li>
              <li><Link href="/#ganhos">Ganhos e Benefícios</Link></li>
              <li><Link href="/#termos">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2024 Chama Jaque. Feito com amor no Brasil.</p>
          <div className="flex items-center gap-1">
            Respeito às profissionais domésticas <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
