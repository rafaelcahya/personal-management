export const metadata = {
  title: 'API Documentation',
  description: 'Personal Management API — Swagger UI',
}

export default function DocsLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
