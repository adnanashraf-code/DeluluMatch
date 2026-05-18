import type { Metadata } from "next";
import "./globals.css";
import { inter, ebGaramond, courier, comic, bebasNeue } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CursorTrail from "@/components/cursed-ui/CursorTrail";
import CartThief from "@/components/cursed-ui/CartThief";
import CookieConsentMafia from "@/components/cursed-ui/CookieConsentMafia";
import LoginBossFight from "@/components/cursed-ui/LoginBossFight";
import PopupManager from "@/components/cursed-ui/PopupManager";
import ChaosController from "@/features/chaos-engine/ChaosController";
import TsunamiController from "@/features/chaos-engine/TsunamiController";
import TsunamiWaterEngine from "@/components/cursed-ui/TsunamiWaterEngine";
import ChaosOptimizationGuard from "@/components/cursed-ui/ChaosOptimizationGuard";
import UniversalTearEngine from "@/components/tearing/UniversalTearEngine";
import { AudioProvider } from "@/components/audio/AudioProvider";
import Soundscape from "@/components/audio/Soundscape";

export const metadata: Metadata = {
  title: "DeluluMatch | Find Your Emotionally Unavailable Soulmate",
  description: "Official award-winning toxic Y2K dating experience. Expect emotional chaos & dynamic page tearing physics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${ebGaramond.variable} ${courier.variable} ${comic.variable} ${bebasNeue.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full bg-[#080208] text-white selection:bg-[#FF007F] selection:text-black">
        <AudioProvider>
          <div className="noise-overlay" />
          <div className="scan-overlay" />
          <div className="crt-vignette" />
          <CursorTrail />
          <CartThief />
          <CookieConsentMafia />
          <LoginBossFight />
          <PopupManager />
          <ChaosController />
          <TsunamiController />
          <TsunamiWaterEngine />
          <ChaosOptimizationGuard />
          <UniversalTearEngine />
          <Soundscape />
          
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
