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

export default function AdminPage() {
  // 1. Quadro de Funcionários
  const funcionarios = [
    { id: 1, foto: "/Imagens/perfil.png", nome: "Ronald", idade: 27, cpf: "111.222.333-44", cargo: "Caixa", status: "Ativo" },
    { id: 2, foto: "/Imagens/perfil.png", nome: "Thyago", idade: 31, cpf: "999.888.777-66", cargo: "Estoquista", status: "Ativo" },
    { id: 3, foto: "/Imagens/perfil.png", nome: "John", idade: 20, cpf: "555.444.333-22", cargo: "Recepcionista", status: "Ativo" }
  ];

  // 2. Estados do Formulário (Adicionar Item)
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [estoqueProduto, setEstoqueProduto] = useState('');
  const [imagemProduto, setImagemProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [classesSelecionadas, setClassesSelecionadas] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  // 3. Estados do Gerenciador de Estoque
  const [catalogo, setCatalogo] = useState<Produto[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [editEstoque, setEditEstoque] = useState(0);

  const classesDisponiveis = ["Uma_mão", "Duas_mãos", "Européia", "Japonesa"];

  useEffect(() => {
    const salvo = JSON.parse(localStorage.getItem('catalogo_armazem') || '[]');
    setCatalogo(salvo);
  }, []);

  const toggleClasse = (classe: string) => {
    setClassesSelecionadas(prev => 
      prev.includes(classe) ? prev.filter(c => c !== classe) : [...prev, classe]
    );
  };

  const handleAdicionarProduto = (e: React.FormEvent) => {
    e.preventDefault();

    if (classesSelecionadas.length === 0) {
      alert("Selecione pelo menos uma classe.");
      return;
    }

    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome: nomeProduto,
      preco: precoProduto.toUpperCase().includes('R$') ? precoProduto : `R$ ${precoProduto}`,
      estoque: parseInt(estoqueProduto) || 0,
      classe: classesSelecionadas,
      descricao: descricaoProduto.trim() !== '' ? descricaoProduto : "...",
      imagem: imagemProduto.trim() !== '' ? imagemProduto : "/Imagens/placeholder.jpg"
    };

    const catalogoAtualizado = [...catalogo, novoProduto];
    setCatalogo(catalogoAtualizado);
    localStorage.setItem('catalogo_armazem', JSON.stringify(catalogoAtualizado));

    setFeedback(`"${novoProduto.nome}" adicionado com sucesso!`);
    
    // Limpa o formulário
    setNomeProduto('');
    setPrecoProduto('');
    setEstoqueProduto('');
    setImagemProduto('');
    setDescricaoProduto('');
    setClassesSelecionadas([]);
    setTimeout(() => setFeedback(''), 3000);
  };

  const iniciarEdicao = (item: Produto) => {
    setEditandoId(item.id);
    setEditNome(item.nome);
    setEditPreco(item.preco);
    setEditEstoque(item.estoque || 0);
  };

  const salvarEdicao = () => {
    const atualizado = catalogo.map(item =>
      item.id === editandoId
        ? { ...item, nome: editNome, preco: editPreco, estoque: editEstoque }
        : item
    );
    setCatalogo(atualizado);
    localStorage.setItem('catalogo_armazem', JSON.stringify(atualizado));
    setEditandoId(null);
  };

  // FUNÇÃO DE DELETAR ITEM
  const deletarProduto = (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja remover "${nome}" do catálogo?`)) {
      const catalogoAtualizado = catalogo.filter(item => item.id !== id);
      setCatalogo(catalogoAtualizado);
      localStorage.setItem('catalogo_armazem', JSON.stringify(catalogoAtualizado));
    }
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--carmesim)', borderBottom: '2px solid var(--carmesim)', paddingBottom: '10px' }}>
        Painel de Informações
      </h1>

      {/* SESSÃO 1: Quadro de Funcionários */}
      <section style={{ marginTop: '30px' }}>
        <h2>Funcionários Registrados</h2>
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--cartao)', borderRadius: '8px', border: '1px solid var(--borda)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--borda)', backgroundColor: 'var(--fundo)' }}>
                <th style={{ padding: '15px', textAlign: 'center' }}>Foto</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Idade</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>CPF</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Cargo</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((func) => (
                <tr key={func.id} style={{ borderBottom: '1px solid var(--borda-fina)' }}>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <img 
                      src={func.foto} 
                      alt={`Foto de ${func.nome}`} 
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--verde-musgo)' }} 
                    />
                  </td>
                  <td style={{ padding: '15px' }}><strong>{func.nome}</strong></td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>{func.idade}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>{func.cpf}</td>
                  <td style={{ padding: '15px' }}>{func.cargo}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      backgroundColor: 'var(--verde-musgo)',
                      color: 'var(--cartao)',
                      border: 'none'
                    }}>
                      {func.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SESSÃO 2: Preencher Catálogo */}
      <section style={{ marginTop: '50px', backgroundColor: 'var(--cartao)', padding: '30px', borderRadius: '8px', border: '2px solid var(--borda)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, color: 'var(--verde-musgo)' }}>Adicionar Item</h2>
        <form onSubmit={handleAdicionarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 300px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Nome</label>
              <input 
                type="text" 
                value={nomeProduto} 
                onChange={(e) => setNomeProduto(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--borda)' }}
              />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Preço (R$)</label>
              <input 
                type="text" 
                value={precoProduto} 
                onChange={(e) => setPrecoProduto(e.target.value)}
                required
                placeholder="Ex: 500,00"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--borda)' }}
              />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Estoque</label>
              <input 
                type="number" 
                value={estoqueProduto} 
                onChange={(e) => setEstoqueProduto(e.target.value)}
                required
                min="0"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--borda)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Caminho da imagem</label>
            <input 
              type="text" 
              value={imagemProduto} 
              onChange={(e) => setImagemProduto(e.target.value)}
              placeholder="/Imagens/europeias ou japonesas/"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--borda)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Descrição</label>
            <textarea 
              value={descricaoProduto} 
              onChange={(e) => setDescricaoProduto(e.target.value)}
              placeholder="..."
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--borda)', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Classes do Item (Múltipla Escolha)</label>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {classesDisponiveis.map(classe => (
                <label key={classe} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={classesSelecionadas.includes(classe)}
                    onChange={() => toggleClasse(classe)}
                  />
                  {classe.replace('_', ' ')}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" style={{ padding: '15px', backgroundColor: 'var(--carmesim)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Adicionar ao Catálogo ⚒️
          </button>

          {feedback && <div style={{ padding: '10px', backgroundColor: 'var(--verde-musgo)', color: '#fff', textAlign: 'center', borderRadius: '4px' }}>{feedback}</div>}
        </form>
      </section>

      {/* SESSÃO 3: Gerenciador de Estoque */}
      <section style={{ marginTop: '50px' }}>
        <h2>Estoque do Armazém</h2>
        {catalogo.length === 0 ? (
          <p>Nenhum item ainda. O catálogo está vazio.</p>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: 'var(--cartao)', borderRadius: '8px', border: '1px solid var(--borda)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--borda)', backgroundColor: 'var(--fundo)' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Nome</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Classes</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Preço</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Estoque</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {catalogo.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--borda-fina)' }}>
                    {editandoId === item.id ? (
                      <>
                        <td style={{ padding: '10px' }}><input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} style={{ width: '100%', padding: '5px' }} /></td>
                        <td style={{ padding: '10px' }}>{item.classe.join(', ')}</td>
                        <td style={{ padding: '10px' }}><input type="text" value={editPreco} onChange={e => setEditPreco(e.target.value)} style={{ width: '80px', padding: '5px' }} /></td>
                        <td style={{ padding: '10px' }}><input type="number" value={editEstoque} onChange={e => setEditEstoque(Number(e.target.value))} style={{ width: '60px', padding: '5px' }} /></td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <button onClick={salvarEdicao} style={{ backgroundColor: 'var(--verde-musgo)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Salvar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '15px' }}><strong>{item.nome}</strong></td>
                        <td style={{ padding: '15px', fontSize: '0.9rem' }}>{item.classe.join(', ').replace(/_/g, ' ')}</td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>{item.preco}</td>
                        <td style={{ padding: '15px', textAlign: 'center', color: item.estoque === 0 ? 'var(--carmesim)' : 'inherit' }}>
                          {item.estoque}
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => iniciarEdicao(item)} 
                            style={{ backgroundColor: 'transparent', border: '1px solid var(--verde-musgo)', color: 'var(--verde-musgo)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => deletarProduto(item.id, item.nome)} 
                            style={{ backgroundColor: 'transparent', border: '1px solid var(--carmesim)', color: 'var(--carmesim)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Excluir
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}