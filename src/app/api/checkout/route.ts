import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, price, quantity, external_reference } = body;

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // Um dev sênior sabe que não se confia apenas no ID do item.
    // Usamos 'external_reference' para amarrar o pagamento ao ID do nosso banco de dados.
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: id,
            title: title,
            quantity: Number(quantity),
            unit_price: Number(price),
            currency_id: 'BRL',
          },
        ],
        external_reference: external_reference || id, // Crucial para o Webhook identificar o pedido
        back_urls: {
          success: `${baseUrl}/dashboard/client?status=success&serviceId=${id}`,
          failure: `${baseUrl}/dashboard/client?status=failure`,
          pending: `${baseUrl}/dashboard/client?status=pending`,
        },
        auto_return: 'approved',
        // Opcional: Configurar URL de notificação para o Webhook
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({ id: preference.id });
  } catch (error) {
    console.error('[SENIOR_CHECKOUT_ERROR]:', error);
    return NextResponse.json({ error: 'Falha crítica na criação do checkout' }, { status: 500 });
  }
}
