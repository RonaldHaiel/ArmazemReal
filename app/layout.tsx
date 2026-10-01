import './globals.css';
import Header from '../components/Header'; 

export const metadata = {
  title: 'Armazen Real',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {/* o cabeçalho universal gerencia a barra do topo */}
        <Header />

        {/* Aqui é onde o conteúdo das páginas é injetado */}
        <main> 
            {children}
        </main>
      </body>
    </html>
  );
}