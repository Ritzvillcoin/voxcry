import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Voxcry Video Audit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface VideoAudit {
  blog_title: string;
  final_label: 'SIGNAL' | 'MIXED' | 'NOISE';
  quality_score: number;
}

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.voxcry.com';

  try {
    const res = await fetch(`${baseUrl}/api/video/${slug}`, { cache: 'no-store' });
    const json = await res.json();
    const video: VideoAudit = json.data;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: '#000000',
            padding: '60px',
            border: '24px solid #ADFF2F',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: 40 }}>
            <div style={{ backgroundColor: '#ADFF2F', color: 'black', padding: '8px 24px', fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>
              VOXCRY_AUDIT_REPORT
            </div>
            <div style={{ color: '#ADFF2F', fontSize: 24, fontWeight: 900 }}>REF: {slug.toUpperCase()}</div>
          </div>

          {/* Label and Score */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: 30 }}>
            <div 
              style={{ 
                border: '4px solid white', 
                padding: '10px 30px', 
                fontSize: 32, 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                // FIXED: Single declaration for backgroundColor and color
                backgroundColor: video?.final_label === 'SIGNAL' ? '#ADFF2F' : 'transparent',
                color: video?.final_label === 'SIGNAL' ? 'black' : 'white' 
              }}
            >
              {video?.final_label || 'PENDING'}
            </div>
            <div style={{ border: '4px solid #ADFF2F', color: '#ADFF2F', padding: '10px 30px', fontSize: 32, fontWeight: 900 }}>
              SCORE: {video?.quality_score ?? '?'}/8
            </div>
          </div>

          <h1 style={{ fontSize: 80, fontWeight: 900, color: 'white', lineHeight: 0.95, textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>
            {video?.blog_title || 'Untitled Signal'}
          </h1>

          <div style={{ display: 'flex', marginTop: 'auto', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ color: 'white', fontSize: 24, fontWeight: 900 }}>STATUS: VERIFIED_SIGNAL</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'black', backgroundColor: '#ADFF2F', padding: '0 25px' }}>VOXCRY</div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (e) {
    console.error("OG Image Error:", e);
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'black', color: '#ADFF2F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, fontWeight: 900 }}>
          VOXCRY_ERROR
        </div>
      ),
      { ...size }
    );
  }
}