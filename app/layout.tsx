import NavBar from '../components/containers/NavBarContainer/NavBarContainer'
import BackButton from '../components/BackButton'
import AdobeFontsLoader from '../components/AdobeFontsLoader'
import '../styles/globals.css'

export const metadata = {
  title: '2025 summer memory',
  description: 'food and city',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dark">
        <AdobeFontsLoader />
        <NavBar />
        <BackButton />
        {children}
        {/* Global modal portal root */}
        <div id="modal-root" />
      </body>
    </html>
  )
}
