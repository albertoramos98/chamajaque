import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// ESTA ROTA É O CORAÇÃO DA CONFIABILIDADE DO PAGAMENTO.
// Ela recebe avisos do Mercado Pago mesmo se o usuário fechar o navegador.

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('data.id');

  console.log(`[MP_WEBHOOK] Recebido tipo: ${type}, ID: ${id}`);

  // 1. Validar se é uma notificação de pagamento
  if (type === 'payment' && id) {
    try {
      // 2. Buscar o status real no Mercado Pago (Prevenir fakes)
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });

      const paymentData = await mpResponse.json();

      if (paymentData.status === 'approved') {
        const serviceId = paymentData.external_reference;
        
        // 3. Atualizar o banco de dados (Supabase) via service role (bypass RLS se necessário no backend)
        // Nota: Para simplificar, usaremos o cliente padrão, mas em prod use o 'service_role' key.
        const supabase = createClient();
        
        // Marcar como pago ou atualizar metadados do checklist
        // Aqui você pode decidir o que acontece no seu fluxo quando o pagamento cai.
        console.log(`[MP_WEBHOOK] Pagamento aprovado para o serviço: ${serviceId}`);
        
        // Exemplo: Salvar o ID do pagamento no registro do serviço
        const { error } = await supabase
          .from('service_requests')
          .update({ 
            observations: `PAGAMENTO CONFIRMADO via Mercado Pago: ID ${id}` 
          })
          .eq('id', serviceId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('[MP_WEBHOOK_ERROR]:', error);
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
  }

  // Mercado Pago exige resposta 200 ou 201 para não reenviar a notificação
  return NextResponse.json({ received: true }, { status: 200 });
}
