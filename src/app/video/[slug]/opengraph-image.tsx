import { ImageResponse } from 'next/og';
import { kv } from "@vercel/kv";

// Define the shape of your Audit data to satisfy TypeScript
interface VideoAudit {
  blog_title: string;
  final_label: 'SIGNAL' | 'MIXED' | 'NOISE';
  quality_score: number;
}

export const runtime = 'edge';
export const alt = 'Voxcry Video Audit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    // 1. Specify the type in the KV get request to remove 'any'
    const video = await kv.get<VideoAudit>(`video:v1:${slug}`);

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
            border: '24px solid #ADFF2F', // Thicker border for more Brutalism
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: 40 }}>
            <div
              style={{
                backgroundColor: '#ADFF2F',
                color: 'black',
                padding: '8px 24px',
                fontSize: 24,
                fontWeight: 900,
                textTransform: 'uppercase',
                boxShadow: '8px 8px 0px 0px white', // Neo-brutalist hard shadow
              }}
            >
              VOXCRY_AUDIT_REPORT
            </div>
            <div style={{ color: '#ADFF2F', fontSize: 24, fontWeight: 900 }}>
              REF: {slug.toUpperCase()}
            </div>
          </div>

          {/* Label and Score */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: 30 }}>
            <div
              style={{
                border: '4px solid white',
                color: 'white',
                padding: '10px 30px',
                fontSize: 32,
                fontWeight: 900,
                textTransform: 'uppercase',
                backgroundColor: video?.final_label === 'SIGNAL' ? '#22c55e' : 'transparent',
              }}
            >
              {video?.final_label || 'AUDIT_PENDING'}
            </div>
            <div
              style={{
                border: '4px solid #ADFF2F',
                color: '#ADFF2F',
                padding: '10px 30px',
                fontSize: 32,
                fontWeight: 900,
                boxShadow: '6px 6px 0px 0px white',
              }}
            >
              SCORE: {video?.quality_score ?? '?'}/8
            </div>
          </div>

          <h1
            style={{
              fontSize: 85,
              fontWeight: 900,
              color: 'white',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              fontStyle: 'italic',
              margin: 0,
              letterSpacing: '-0.05em',
              maxWidth: '1000px',
            }}
          >
            {video?.blog_title || 'Untitled Signal'}
          </h1>

          {/* Footer Branding */}
          <div
            style={{
              display: 'flex',
              marginTop: 'auto',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#ADFF2F', fontSize: 18, fontWeight: 900 }}>STATUS:</div>
              <div style={{ color: 'white', fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>
                Verified_Attention_Signal
              </div>
            </div>
            
            <div style={{ 
              fontSize: 48, 
              fontWeight: 900, 
              color: 'black', 
              backgroundColor: '#ADFF2F',
              padding: '0 25px',
              boxShadow: '10px 10px 0px 0px white'
            }}>
              VOXCRY
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    // 2. Log error to console to satisfy the 'unused-vars' linter
    console.error(`OG Image Generation Error for ${slug}:`, error);
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