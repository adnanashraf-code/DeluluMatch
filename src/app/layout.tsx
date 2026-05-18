import type { Metadata } from "next";
import "./globals.css";
import { inter, ebGaramond, courier, comic, bebasNeue } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import TransitionOverlay from "@/components/motion/TransitionOverlay";
import CursorTrail from "@/components/cursed-ui/CursorTrail";
import PopupManager from "@/components/cursed-ui/PopupManager";
import ChaosController from "@/features/chaos-engine/ChaosController";
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
          <PopupManager />
          <ChaosController />
          <Soundscape />
          
          <TransitionOverlay />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
