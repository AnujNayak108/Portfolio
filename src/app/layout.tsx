
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Correctly import global styles
import { Toaster } from "@/components/ui/toaster";
import CosmicMeshBackground from '@/components/effects/cosmic-mesh-background';
import SnowfallIceAgeMesh from '@/components/effects/SnowfallIceAgeMesh';
import { SnowflakeBackground } from '@/components/effects/Snowmesh';
import { OWNER_NAME } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: `${OWNER_NAME} | Cosmic Folio`,
  description: 'A personal portfolio showcasing projects, skills, and experience with a cosmic theme.',
  icons: {
    icon: '/favicon.ico', // Assuming you might add a favicon later
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased flex flex-col min-h-screen relative bg-background text-foreground">
        <CosmicMeshBackground/>
        <div className="relative z-0 flex flex-col flex-grow w-full">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
