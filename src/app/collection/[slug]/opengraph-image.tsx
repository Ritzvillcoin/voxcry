import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'VoxCry Collection';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    // 1. Fetch data from your API
    const res = await fetch(`${baseUrl}/api/collection/${slug}`);
    const json = await res.json();
    const collection = json.data;

    return new ImageResponse(
      (
        // Main Container
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#ADFF00', // Neon Green
            padding: '80px',
            border: '24px solid black',
          }}
        >
          {/* Top Label */}
          <div
            style={{
              backgroundColor: 'black',
              color: '#ADFF00',
              padding: '8px 24px',
              fontSize: 28,
              fontWeight: 900,
              marginBottom: 40,
              textTransform: 'uppercase',
              letterSpacing: '-0.05em',
              fontStyle: 'italic',
            }}
          >
            VOXCRY_ARCHIVE
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: 'black',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              fontStyle: 'italic',
              margin: 0,
              padding: 0,
              letterSpacing: '-0.05em',
            }}
          >
            {collection?.title || 'TikTok Pack'}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 32,
              color: 'black',
              fontWeight: 600,
              marginTop: 30,
              maxWidth: '900px',
              lineHeight: 1.2,
            }}
          >
            {collection?.description?.substring(0, 100)}...
          </p>

          {/* Footer Branding */}
          <div
            style={{
              display: 'flex',
              marginTop: 'auto',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                fontWeight: 900,
                backgroundColor: 'white',
                padding: '12px 24px',
                border: '4px solid black',
                boxShadow: '8px 8px 0px 0px black',
              }}
            >
              OPEN_COLLECTION →
            </div>
            
            <div style={{ fontSize: 24, fontWeight: 900, color: 'black' }}>
              VOXCRY.COM
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    // Fallback if fetch fails
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'black', color: '#ADFF00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, fontWeight: 900 }}>
          VOXCRY
        </div>
      ),
      { ...size }
    );
  }
}