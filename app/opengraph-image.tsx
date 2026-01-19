import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ニュースでまなぶ！日本のルール";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FEF9F3 0%, #FFF5E6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          position: "relative",
        }}
      >
        {/* 装飾ドット */}
        <div
          style={{
            position: "absolute",
            left: "5%",
            top: "10%",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#a8e063",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "12%",
            bottom: "15%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#6b9bd1",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "22%",
            top: "20%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fdd663",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "25%",
            bottom: "25%",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#f28b82",
            opacity: 0.75,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "40%",
            top: "15%",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#fdd663",
            opacity: 0.65,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "25%",
            bottom: "20%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#81c995",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "15%",
            top: "12%",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#7baaf7",
            opacity: 0.75,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "5%",
            bottom: "10%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#f28b82",
            opacity: 0.6,
          }}
        />

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          {/* アイコン */}
          <svg width="140" height="140" viewBox="0 -5 24 24" fill="none">
            {/* 土台 */}
            <rect x="1" y="19" width="22" height="3" rx="0.5" fill="#C56A1F" />
            {/* 左翼 */}
            <rect x="2" y="10" width="7" height="9" rx="0.5" fill="#E07B2E" />
            {/* 右翼 */}
            <rect x="15" y="10" width="7" height="9" rx="0.5" fill="#E07B2E" />
            {/* 中央部分 */}
            <rect x="9" y="12" width="6" height="7" rx="0.5" fill="#F5A623" />
            {/* 中央塔本体 */}
            <rect x="9" y="6" width="6" height="6" rx="0.5" fill="#E07B2E" />
            {/* 中央塔の三角屋根 */}
            <path d="M12 1 L8 6 L16 6 Z" fill="#C56A1F" />
            {/* 窓 */}
            <rect x="3.5" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="3.5" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="6" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="6" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="16" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="16" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="18.5" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="18.5" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
            <rect x="10.5" y="14" width="3" height="3" rx="0.3" fill="#FEF3C7" />
            <rect x="10.5" y="7.5" width="3" height="3" rx="0.3" fill="#FEF3C7" />
          </svg>

          {/* タイトル */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                display: "flex",
              }}
            >
              <span style={{ color: "#C56A1F" }}>ニュース</span>
              <span style={{ color: "#1a1a1a" }}>でまなぶ！</span>
            </div>
          </div>
        </div>

        {/* リボン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginTop: -16,
          }}
        >
          {/* 左側の装飾ライン */}
          <div
            style={{
              width: 80,
              height: 4,
              background: "#C56A1F",
              borderRadius: 2,
            }}
          />
          {/* リボン本体 */}
          <div
            style={{
              position: "relative",
              width: 320,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="320"
              height="64"
              viewBox="0 0 160 32"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {/* 曲線のリボン背景 */}
              <path
                d="M25 8 Q80 -5 135 8 L130 24 Q80 35 30 24 Z"
                fill="#E07B2E"
              />
            </svg>
            {/* テキスト（SVG外で描画） */}
            <span
              style={{
                position: "relative",
                color: "white",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              日本のルール
            </span>
          </div>
          {/* 右側の装飾ライン */}
          <div
            style={{
              width: 80,
              height: 4,
              background: "#C56A1F",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
