import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#FEF9F3",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 -5 24 24"
          fill="none"
        >
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
      </div>
    ),
    {
      ...size,
    }
  );
}
