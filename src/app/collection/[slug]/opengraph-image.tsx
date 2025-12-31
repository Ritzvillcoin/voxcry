import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'VoxCry Collection Pack';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // Fetch the collection data to get the title
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collection/${params.slug}`);
  const json = await res.json();
  const collection = json.data;

  return new ImageResponse(
    (
      // This is essentially HTML/CSS that gets turned into a PNG
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        {/* The Neon Green Border Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            border: '8px solid #ADFF2F',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Top Label */}
          <div style={{
            color: '#ADFF2F',
            fontSize: 24,
            fontFamily: 'monospace',
            marginBottom: 40,
            letterSpacing: '0.2em'
          }}>
            {collection?.videoIds?.length || 5} VIDEOS • VOXCRY.COM
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'white',
              textTransform: 'uppercase',
              fontStyle: 'italic',
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {collection?.title || 'NEW COLLECTION'}
          </div>

          {/* Description */}
          <div style={{
            marginTop: 40,
            fontSize: 32,
            color: '#A1A1AA',
            maxWidth: '800px',
          }}>
            {collection?.description?.substring(0, 100)}...
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}