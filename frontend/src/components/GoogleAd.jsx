// src/components/GoogleAd.jsx
import { useEffect, useRef } from "react";

export default function GoogleAd() {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // This is the same as Google's:
      // (adsbygoogle = window.adsbygoogle || []).push({});
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <div style={{ width: "100%", padding: "12px 0" }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8830892448170971"
        data-ad-slot="1068554563"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
