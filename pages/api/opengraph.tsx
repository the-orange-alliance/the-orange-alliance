import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge'
};

const font = fetch(
  new URL('../../public/assets/fonts/Roboto-Bold.ttf', import.meta.url).toString()
).then(res => res.arrayBuffer());

const key = crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(process.env.OG_SECRET ?? ''),
  { name: 'HMAC', hash: { name: 'SHA-256' } },
  false,
  ['sign']
);

function toHex(arrayBuffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), n => n.toString(16).padStart(2, '0'))
    .join('');
}

const handler = async function (req: NextRequest) {
  const fontData = await font;

  const { searchParams } = req.nextUrl;
  const token = searchParams.get('token');
  const dataRaw = searchParams.get('data') || '{}';

  const verifyToken = toHex(
    await crypto.subtle.sign('HMAC', await key, new TextEncoder().encode(dataRaw))
  );

  if (token !== verifyToken) {
    return new Response('Invalid token.', { status: 401 });
  }

  const data = JSON.parse(dataRaw);
  const title = data.title;
  const description1 = data.description || data.description1;
  const description2 = data.description2;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          color: 'white',
          fontFamily: 'Roboto',
          background: 'black',
          padding: 120
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            padding: '12px 24px',
            color: 'black',
            background: 'white',
            borderRadius: 48
          }}
        >
          The Orange Alliance
        </span>
        <div style={{ margin: '80px 0 0', fontSize: 64, lineHeight: 1.2 }}>{title}</div>
        <div style={{ margin: '32px 0 0', fontSize: 32 }}>{description1}</div>
        <div style={{ margin: '16px 0 0', fontSize: 32 }}>{description2}</div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      // debug: true,
      fonts: [
        {
          name: 'Roboto',
          data: fontData
        }
      ]
    }
  );
};

export default handler;
