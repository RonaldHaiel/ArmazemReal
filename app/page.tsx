"use client";

import { useState, useEffect } from 'react';

interface Produto {
  id: string;
  nome: string;
  preco: string;
  estoque: number;
  classe: string[];
  descricao?: string;
  imagem: string;
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  //Estado para verificar se há usuário logado
  const [usuarioAtivo, setUsuarioAtivo] = useState<string | null>(null);

 // Carrega os itens salvos e verifica o usuário logado
  useEffect(() => {
    const itensSalvos = JSON.parse(localStorage.getItem('catalogo_armazem') || '[]');
    setProdutos(itensSalvos);
    //Função para checar o usuário logado
    const checarUsuario = () => {
      const user = localStorage.getItem('usuarioAtivo');
      setUsuarioAtivo(user);
    }; checarUsuario();
    // Recebe o evento disparado no Login ou Logout
    window.addEventListener('usuario-alterado', checarUsuario);
    // Limpa o recebedor para evitar bugs de memória
    return () => {
      window.removeEventListener('usuario-alterado', checarUsuario);
    };
  }, []);

  //Função para colocar o item na bolsa do usuário específico
  const adicionarAoCarrinho = (produto: Produto) => {
    if (!usuarioAtivo) return;
    
    // Usa a mesma chave que a página de inventário usa para ler
    const chaveInventario = `inventario_${usuarioAtivo}`;
    const inventarioAtual = JSON.parse(localStorage.getItem(chaveInventario) || "[]");
    
    inventarioAtual.push(produto);
    localStorage.setItem(chaveInventario, JSON.stringify(inventarioAtual));
    
    alert(`${produto.nome} foi adicionado à sua bolsa de provisões!`);
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {produtos.length === 0 ? (
        <p style={{ textAlign: 'center', opacity: 0.7, padding: '40px 0' }}>
          O armazém está vazio no momento.
        </p>
      ) : (
        produtos.map(item => (
          <div 
            key={item.id} 
            style={{
              backgroundColor: 'var(--cartao)',
              border: '1px solid var(--borda)',
              borderRadius: '6px',
              padding: '25px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            {/* Cabeçalho do Cartão: Título e Tags */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ borderBottom: '2px solid var(--carmesim)', paddingBottom: '4px' }}>
                <h2 style={{ margin: 0, color: 'var(--carmesim)', fontSize: '1.8rem' }}>
                  {item.nome}
                </h2>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {item.classe.map(c => (
                  <span 
                    key={c} 
                    style={{ 
                      backgroundColor: '#5C4A42',
                      color: '#FFF',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '4px 12px', 
                      borderRadius: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {c.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Área da Imagem Larga (Banner) */}
            <div style={{ 
              width: '100%', 
              height: '300px', 
              backgroundColor: 'transparent', 
              marginBottom: '20px', 
              border: '1px solid var(--borda-fina)', 
              borderRadius: '4px', 
              overflow: 'hidden' 
            }}>
              <img 
                src={item.imagem || "/Imagens/placeholder.jpg"} 
                alt={item.nome}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>

            {/* Descrição do Item */}
            <p style={{ margin: '0 0 15px 0', fontSize: '1.05rem', color: 'var(--texto)' }}>
              {item.descricao || "Artefato forjado na guilda."}
            </p>

            {/* Status de Estoque */}
            <div style={{ 
              marginBottom: '20px', 
              color: 'var(--verde-musgo)', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              {item.estoque > 0 ? (
                <>✅ Em Estoque</>
              ) : (
                <><span style={{ color: 'var(--carmesim)' }}>❌ Fora de Estoque</span></>
              )}
            </div>

            {/* Rodapé: Preço e Botão */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--verde-musgo)' }}>
                {item.preco}
              </span>
              {/* NOVO: Verifica se existe usuário ativo */}
              {usuarioAtivo ? (
                <button 
                  onClick={() => adicionarAoCarrinho(item)}
                  disabled={item.estoque <= 0}
                  style={{ 
                    backgroundColor: item.estoque > 0 ? 'var(--verde-musgo)' : '#A3998D', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 24px', 
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: item.estoque > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  {item.estoque > 0 ? 'Adicionar ao Carrinho' : 'Sem Estoque'}
              </button>
              ) : (
              <button 
                disabled
                style={{ 
                  backgroundColor: '#A3998D',
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 24px', 
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'not-allowed'
                }}
              >
                Identifique-se
              </button>
              )}
            </div>
          </div>
        ))
      )}
    </main>
  );
}