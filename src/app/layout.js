import './globals.css'
import Header from '@/components/Header/Header'

export const metadata = {
  title: 'Youth Advocacy Board',
  description: 'The offical website of the St. Paul Youth Advocacy Board.',
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  )
}
