import NavBar from '../components/containers/NavBarContainer/NavBarContainer'
import BackButton from '../components/BackButton'
import AdobeFontsLoader from '../components/AdobeFontsLoader'
import '../styles/globals.css'
import AnchorScrollFix from '../components/AnchorScrollFix'
import Footer from '../components/Footer'
import Script from 'next/script'
import RouteTransition from '../components/RouteTransition'

export const metadata = {
  title: '2025 summer memory',
  description: 'food and city',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dark min-h-screen flex flex-col">
        {/* Lottie (bodymovin) CDN for JSON-based animations */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js" strategy="afterInteractive" data-lottie-cdn="true" />
        <AdobeFontsLoader />
        <NavBar />
        <AnchorScrollFix />
        <RouteTransition />
        <BackButton />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        {/* Global modal portal root */}
        <div id="modal-root" />
      </body>
    </html>
  )
}
