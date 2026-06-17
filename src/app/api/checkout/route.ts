import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, price, quantity } = body;

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

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
        back_urls: {
          success: `${baseUrl}/dashboard/client?status=success`,
          failure: `${baseUrl}/dashboard/client?status=failure`,
          pending: `${baseUrl}/dashboard/client?status=pending`,
        },
        auto_return: 'approved',
      },
    });

    return NextResponse.json({ id: preference.id });
  } catch (error) {
    console.error('Mercado Pago Error:', error);
    return NextResponse.json({ error: 'Erro ao criar preferência de pagamento' }, { status: 500 });
  }
}
