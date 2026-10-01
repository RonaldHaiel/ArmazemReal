"use client";

import { useMemo } from 'react';

// A mesma tipagem de Produto
interface Produto {
  id: string;
  nome: string;
  preco: string;
  classe: string[];
}

interface ModalCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  itens: Produto[];
  onFinalizar: () => void;
}

export default function ModalCheckout({ isOpen, onClose, itens, onFinalizar }: ModalCheckoutProps) {
  
  // useMemo faz com que a matemática só seja recalculada se os itens mudarem
  const total = useMemo(() => {
    return itens.reduce((acumulador, item) => {
      // Remove o "R$", espaços, pontos de milhar, e troca a vírgula por ponto.
      const textoLimpo = item.preco.replace('R$', '').trim().replace('.', '').replace(',', '.');
      const valorNumero = parseFloat(textoLimpo);
      
      return acumulador + (isNaN(valorNumero) ? 0 : valorNumero);
    }, 0);
  }, [itens]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Caixa um pouco mais larga para o resumo da compra */}
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <button className="modal-fechar" onClick={onClose} title="Voltar">✖</button>
        
        <h2 style={{ textAlign: 'center', color: 'var(--carmesim)', margin: '0 0 20px 0', textTransform: 'uppercase' }}>
          Resumo da compra
        </h2>
        
        {/* Lista com rolagem caso o usuário tenha muitos itens */}
        <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px', borderBottom: '2px solid var(--borda)' }}>
          {itens.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--borda-fina)' }}>
              <span>{item.nome}</span>
              <span style={{ fontWeight: 'bold' }}>{item.preco}</span>
            </div>
          ))}
        </div>

        {/* Totalizador */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '25px' }}>
          <span>Total da Jornada:</span>
          <span style={{ color: 'var(--verde-musgo)' }}>
            {/* Formata o número de volta para a moeda Brasileira */}
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <button 
          onClick={onFinalizar}
          style={{ width: '100%', padding: '15px', background: 'var(--verde-musgo)', color: 'var(--cartao)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}