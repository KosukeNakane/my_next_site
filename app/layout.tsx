import NavBar from '../components/containers/NavBarContainer/NavBarContainer'
import BackButton from '../components/BackButton'
import AdobeFontsLoader from '../components/AdobeFontsLoader'
import '../styles/globals.css'
import AnchorScrollFix from '../components/AnchorScrollFix'
import Footer from '../components/Footer'

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
        <AdobeFontsLoader />
        <NavBar />
        <AnchorScrollFix />
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
