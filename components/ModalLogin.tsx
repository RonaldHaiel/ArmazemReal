"use client";

import { useState, useEffect } from 'react';

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (nome: string) => void;
  modoInicial: 'login' | 'registro';
}

export default function ModalLogin({ isOpen, onClose, onSuccess, modoInicial }: ModalLoginProps) {
  const [isLogin, setIsLogin] = useState(modoInicial === 'login');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    setIsLogin(modoInicial === 'login');
  }, [modoInicial, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nomeAjustado = nome.trim();
    if (nomeAjustado === '' || senha.trim() === '') {
      alert('Por favor, preencha seu nome e sua senha mágica!');
      return;
    }

    // 1. Puxamos o "banco de dados" de usuários salvos no navegador
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios_registrados') || '[]');

    if (isLogin) {
      // --- LÓGICA DE LOGIN ---
      // Procura se existe alguém com esse nome (ignorando maiúsculas/minúsculas)
      const usuarioEncontrado = usuariosSalvos.find((u: any) => u.nome.toLowerCase() === nomeAjustado.toLowerCase());

      if (!usuarioEncontrado) {
        alert('Este aventureiro não consta nos nossos registros. Aliste-se primeiro!');
        return;
      }

      if (usuarioEncontrado.senha !== senha) {
        alert('Senha incorreta! Os guardas estão de olho em você.');
        return;
      }

      // Login com sucesso
      localStorage.setItem('usuarioAtivo', usuarioEncontrado.nome);
      onSuccess(usuarioEncontrado.nome);
      window.dispatchEvent(new Event("usuario-alterado")); // Avisa a aplicação

    } else {
      // --- LÓGICA DE REGISTRO ---
      // Verifica se o nome já existe
      const usuarioJaExiste = usuariosSalvos.find((u: any) => u.nome.toLowerCase() === nomeAjustado.toLowerCase());

      if (usuarioJaExiste) {
        alert('Este nome já está em uso por outro membro da guilda. Escolha outro!');
        return;
      }

      // Registro com sucesso
      const novoUsuario = { nome: nomeAjustado, senha: senha };
      usuariosSalvos.push(novoUsuario);

      // Salva a lista atualizada de usuários
      localStorage.setItem('usuarios_registrados', JSON.stringify(usuariosSalvos));

      // Já faz o login automático após registrar
      localStorage.setItem('usuarioAtivo', novoUsuario.nome);
      onSuccess(novoUsuario.nome);
      window.dispatchEvent(new Event("usuario-alterado")); // Avisa a aplicação
    }

    // Limpa os campos após o sucesso
    setNome('');
    setSenha('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={onClose} title="Fechar">✖</button>

        <h2 style={{ textAlign: 'center', color: 'var(--carmesim)', margin: 0, textTransform: 'uppercase' }}>
          {isLogin ? 'Entrar no Armazém' : 'Alistar-se'}
        </h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Seu Nome (ex: Arthur)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Sua Senha Mágica"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" style={{ padding: '12px', background: 'var(--verde-musgo)', color: 'var(--cartao)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {isLogin ? 'Acessar' : 'Registrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', margin: '20px 0 0 0', fontSize: '0.9rem' }}>
          {isLogin ? 'Não possui registro?' : 'Já é membro do armazém?'}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--carmesim)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
          >
            {isLogin ? 'Registre-se aqui' : 'Entre aqui'}
          </button>
        </p>
      </div>
    </div>
  );
}