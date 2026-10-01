"use client";

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ModalLogin from './ModalLogin';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [usuario, setUsuario] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false); // Estado do menu sanduíche

  const classesDisponiveis = ["Uma_mão", "Duas_mãos", "Européia", "Japonesa"];
  const classeAtiva = searchParams.get('cat') || 'todos';

  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState<'login' | 'registro'>('login');

  const handleLoginSuccess = (nome: string) => {
    setUsuario(nome);
    setModalAberto(false);
  };

  useEffect(() => {
    const user = localStorage.getItem('usuarioAtivo');
    setUsuario(user);
    const buscaAtual = searchParams.get('q') || '';
    setTermoBusca(buscaAtual);
  }, [searchParams]);

  const fazerLogoff = () => {
    localStorage.removeItem('usuarioAtivo');
    setUsuario(null);
    setMenuAberto(false); // Fecha o menu ao sair
    window.dispatchEvent(new Event("usuario-alterado")); // Avisa a aplicação
    router.push('/');
  };

  const lidarComBusca = (novoTermo: string) => {
    setTermoBusca(novoTermo);
    router.push(`/?q=${novoTermo}&cat=${classeAtiva}`);
  };

  const mudarFiltroClasse = (novaClasse: string) => {
    router.push(`/?q=${termoBusca}&cat=${novaClasse}`);
    setMenuAberto(false); // Fecha o menu no celular após escolher
  };

  // Componente reutilizável para a área do usuário (Login/Inventário)
  const AreaUsuario = () => (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      {usuario ? (
        <>
          <span style={{ marginRight: '10px' }}>Saudações, <strong style={{ color: 'var(--carmesim)' }}>{usuario}</strong>!</span>
          {usuario !== 'admin' && (
            <Link href="/inventario" className="btn-link" onClick={() => setMenuAberto(false)} style={{ textDecoration: 'none' }}>
              Sua Bolsa 🎒
            </Link>
          )}
          <button onClick={fazerLogoff} className="btn-perigo" style={{ padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Partir
          </button>
        </>
      ) : (
        <>
          <button className="btn-vazado" onClick={() => { setModoModal('registro'); setModalAberto(true); setMenuAberto(false); }}>Alistar-se</button>
          <button onClick={() => { setModoModal('login'); setModalAberto(true); setMenuAberto(false); }}>Entrar</button>
        </>
      )}
    </div>
  );

  return (
    <header style={{
      backgroundColor: 'var(--cartao)', borderBottom: '4px solid var(--borda)',
      padding: '15px 25px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>

      {/* TOPO: Logo e Botão Sanduíche */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--carmesim)', fontWeight: 'bold', fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Armazém Real ⚔️
        </Link>

        {/* Renderizado apenas no Desktop pelo CSS */}
        <div className="usuario-desktop">
          <AreaUsuario />
        </div>

        {/* O botão Sanduíche só aparece no Mobile pelo CSS */}
        <button className="btn-sanduiche" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? '✖' : '☰'}
        </button>
      </div>

      {/* ÁREA COLAPSÁVEL: Escondida no mobile, a menos que menuAberto seja true */}
      <div className={`menu-colapsavel ${menuAberto ? 'aberto' : ''}`}>

        {/* Usuário no Mobile (Renderizado aqui dentro para colapsar) */}
        <div className="usuario-mobile">
          <AreaUsuario />
        </div>

        {/* Filtros e Busca (Aparece apenas na tela inicial) */}
        {pathname === '/' && (
          <div className="area-filtros" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', paddingTop: '15px', borderTop: '1px dashed var(--borda-fina)', marginTop: '15px' }}>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar..."
                value={termoBusca}
                onChange={(e) => lidarComBusca(e.target.value)}
                style={{ width: '100%', backgroundColor: 'var(--fundo)', border: '2px solid var(--borda)', color: 'var(--texto)', padding: '10px', borderRadius: '4px', fontFamily: 'Georgia, serif' }}
              />
            </div>

            <div className="botoes-classes" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => mudarFiltroClasse('todos')}
                className={`btn-filtro ${classeAtiva === 'todos' ? 'ativo' : ''}`}
                style={{ padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Georgia, serif', backgroundColor: classeAtiva === 'todos' ? 'var(--borda)' : 'var(--fundo)', color: classeAtiva === 'todos' ? 'var(--cartao)' : 'var(--texto)', border: '1px solid var(--borda)' }}
              >
                Todos
              </button>

              {classesDisponiveis.map(classe => (
                <button
                  key={classe}
                  onClick={() => mudarFiltroClasse(classe)}
                  style={{ padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Georgia, serif', backgroundColor: classeAtiva === classe ? 'var(--borda)' : 'var(--fundo)', color: classeAtiva === classe ? 'var(--cartao)' : 'var(--texto)', border: '1px solid var(--borda)' }}
                >
                  {classe.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ModalLogin
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={handleLoginSuccess}
        modoInicial={modoModal}
      />
    </header>
  );
}