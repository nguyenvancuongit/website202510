"use client";

import { useEffect, useState } from "react";

interface FixedCaptchaProps {
  appId: string;
  onSuccess: (ticket: string, randstr: string) => void;
  onError?: (error: any) => void;
  className?: string;
}

declare global {
  interface Window {
    TencentCaptcha: any;
  }
}

export function TencentCaptcha({
  appId,
  onSuccess,
  onError,
  className = "",
}: FixedCaptchaProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://ssl.captcha.qq.com/TCaptcha.js"]');

    if (existingScript) {
      setIsReady(true);
      return;
    }


    // Load Tencent Captcha script
    const script = document.createElement("script");
    script.src = "https://ssl.captcha.qq.com/TCaptcha.js";
    script.async = true;
    script.onload = () => {
      setIsReady(true);
    };
    script.onerror = () => {
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid reloading
    };
  }, []);

  const showCaptcha = () => {
    if (!isReady || !window.TencentCaptcha) {
      return;
    }

    if (!appId || appId === "your_captcha_app_id_here") {
      onError?.({ message: "Captcha App ID not configured" });
      return;
    }

    try {
      // Add CSS to ensure captcha has highest z-index
      const style = document.createElement("style");
      style.textContent = `
        [id*="tcaptcha"], [class*="tcaptcha"], iframe[src*="captcha"] {
          z-index: 999999 !important;
          position: fixed !important;
          pointer-events: auto !important;
        }
        /* Only target specific modal overlays, not all dialogs */
        [data-radix-portal] > div:first-child {
          z-index: 1 !important;
          pointer-events: none !important;
        }
        /* Target the specific customer modal backdrop */
        [data-radix-dialog-overlay] {
          z-index: 1 !important;
          pointer-events: none !important;
        }
        /* Target the specific customer modal content */
        [data-radix-dialog-content] {
          z-index: 1 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);

      const captcha = new window.TencentCaptcha(appId, (res: any) => {
        // Remove the style after captcha interaction
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }

        if (res.ret === 0) {
          // Success
          onSuccess(res.ticket, res.randstr);
        } else {
          // Error or user cancelled
          onError?.(res);
        }
      }, {
        type: "popup",
        bizState: "cooperation-form",
        needFeedBack: false,
        showHeader: true,
        enableDarkMode: false,
      });

      captcha.show();

    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={showCaptcha}
        disabled={!isReady || !appId}
        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isReady ? "加载中..." : !appId ? "请配置Captcha App ID" : "点击进行安全验证"}
      </button>
    </div>
  );
}

