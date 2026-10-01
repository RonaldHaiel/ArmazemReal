"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Para redirecionar depois da compra
import ModalCheckout from '../../components/ModalCheckout';

interface Produto {
  id: string;
  nome: string;
  preco: string;
  classe: string[];
}

export default function Inventario() {
  const router = useRouter();
  const [itens, setItens] = useState<Produto[]>([]);
  const [usuarioAtivo, setUsuarioAtivo] = useState<string | null>(null);
  const [checkoutAberto, setCheckoutAberto] = useState(false); // Controle do pop-up

  useEffect(() => {
    const user = localStorage.getItem('usuarioAtivo');
    setUsuarioAtivo(user);

    if (user) {
      const chaveInventario = `inventario_${user}`;
      const salvos = JSON.parse(localStorage.getItem(chaveInventario) || "[]");
      setItens(salvos);
    }
  }, []);

  const removerItemIndividual = (posicao: number) => {
    if (!usuarioAtivo) return;
    const novosItens = itens.filter((_, index) => index !== posicao);
    setItens(novosItens);
    localStorage.setItem(`inventario_${usuarioAtivo}`, JSON.stringify(novosItens));
  };

  const limparInventario = () => {
    if (usuarioAtivo && confirm("Deseja esvaziar tudo?")) {
      localStorage.removeItem(`inventario_${usuarioAtivo}`);
      setItens([]);
    }
  };

  // Função que finaliza a compra com sucesso
  const finalizarAcordo = () => {
    alert("Acordo realizado com sucesso!.");

    // Limpa a bolsa após o sucesso
    localStorage.removeItem(`inventario_${usuarioAtivo}`);
    setItens([]);
    setCheckoutAberto(false);

    // Redireciona o usuário de volta para o catálogo
    router.push('/');
  };

  if (!usuarioAtivo) {
    return (
      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--carmesim)' }}>Acesso Negado</h1>
        <p>Aliste-se ou entre para ver sua bolsa!</p>
        <Link href="/" style={{ color: 'var(--verde-musgo)', textDecoration: 'underline' }}>Voltar</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid var(--carmesim)', paddingBottom: '10px' }}>Bolsa</h1>
      <p>Itens selecionados, <strong>{usuarioAtivo}</strong>:</p>

      {itens.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <h2>Sua bolsa está vazia.</h2>
          <Link href="/" style={{ padding: '10px 20px', background: 'var(--carmesim)', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
            Voltar à loja
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {itens.map((produto, index) => (
              <div
                key={index}
                className="item-card"
                style={{
                  backgroundColor: 'var(--cartao)',
                  border: '2px solid var(--borda)',
                  padding: '15px',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--carmesim)' }}>{produto.nome}</strong>
                  <span style={{ color: 'var(--verde-musgo)', fontWeight: 'bold' }}>{produto.preco}</span>
                </div>
                <button
                  onClick={() => removerItemIndividual(index)}
                  className="btn-perigo"
                  style={{ padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Descartar
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button onClick={limparInventario} style={{ background: 'transparent', border: 'none', color: 'var(--texto)', textDecoration: 'underline', cursor: 'pointer' }}>
              Esvaziar Bolsa
            </button>
            {/* botão Modal */}
            <button
              onClick={() => setCheckoutAberto(true)}
              style={{ background: 'var(--carmesim)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Finalizar ➔
            </button>
          </div>
        </div>
      )}

      {/* O Modal de Checkout invisível até que checkoutAberto seja true */}
      <ModalCheckout
        isOpen={checkoutAberto}
        onClose={() => setCheckoutAberto(false)}
        itens={itens}
        onFinalizar={finalizarAcordo}
      />
    </main>
  );
}