from flask import Flask, jsonify, request, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Classes mantidas para exemplo
lista_classes = ["Uma_mão", "Duas_mãos", "Européia", "Japonesa"]

# Itens mantidos para exemplo
itens_catalogo = [
    {
        "id": "001",
        "nome": "Montante",
        "preco": "R$ 6131,99",
        "estoque": 30,
        "classe": ["Duas_mãos", "Européia"],
        "descricao": "Espada longa militar da Península Ibérica entre os séculos XV e XVI.",
        "imagem": "Imagens/europeias/montante.jpg"
    },
    {
        "id": "002",
        "nome": "Sabre Polonês",
        "preco": "R$ 4402,99",
        "estoque": 37,
        "classe": ["Uma_mão", "Européia"],
        "descricao": "Uma arma de cavalaria polonesa usada entre os séculos XV e XIX.",
        "imagem": "Imagens/europeias/sabre.jpg"
    },
    {
        "id": "003",
        "nome": "Katana",
        "preco": "R$ 2202,99",
        "estoque": 46,
        "classe": ["Uma_mão", "Duas_mãos", "Japonesa"],
        "descricao": "Arma civil japonesa usada do século XIII ao século XIX.",
        "imagem": "Imagens/japonesas/katana.jpg"
    },
    {
        "id": "004",
        "nome": "Nodachi",
        "preco": "R$ 3199,99",
        "estoque": 15,
        "classe": ["Duas_mãos", "Japonesa"],
        "descricao": "Espada militar japonesa utilizada do século VIII ao século XVI.",
        "imagem": "Imagens/japonesas/nodachi.png"
    },
    {
        "id": "005",
        "nome": "Rapieira",
        "preco": "R$ 6977,99",
        "estoque": 40,
        "classe": ["Uma_mão", "Européia"],
        "descricao": "Uma arma espanhola refinada do século XVII.",
        "imagem": "Imagens/europeias/rapieira.jpg"
    },
    
]

# Rotas de páginas
@app.route('/')
def index(): return send_from_directory('.', 'index.html')

@app.route('/inventario.html')
def inventario(): return send_from_directory('.', 'inventario.html')

@app.route('/checkout.html')
def checkout(): return send_from_directory('.', 'checkout.html')

@app.route('/admin.html')
def admin_page(): return send_from_directory('.', 'admin.html')


# --- API DE PRODUTOS ---
@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    return jsonify(itens_catalogo)

@app.route('/api/produtos', methods=['POST'])
def adicionar_produto():
    dados = request.get_json(silent=True) or {}
    novo_id = str(max([int(item['id']) for item in itens_catalogo]) + 1) if itens_catalogo else "101"
    classes_produto = [c.strip() for c in dados.get('classe', '').split(',') if c.strip()]
    
    imagem_url = dados.get('imagem', '').strip()
    if not imagem_url:
        imagem_url = 'Imagens/placeholder.jpg'
    
    estoque_inicial = int(dados.get('estoque') or 0)
    
    novo_item = {
        "id": novo_id,
        "nome": dados.get('nome', 'Produto Sem Nome'),
        "classe": classes_produto,
        "descricao": dados.get('descricao', ''),
        "preco": f"R$ {dados.get('preco', '0,00')}",
        "imagem": imagem_url,
        "estoque": estoque_inicial # Novo campo
    }
    itens_catalogo.append(novo_item)
    return jsonify({"success": True})

@app.route('/api/produtos/<id_produto>', methods=['DELETE'])
def remover_produto(id_produto):
    global itens_catalogo
    itens_catalogo = [item for item in itens_catalogo if item['id'] != id_produto]
    return jsonify({"success": True})


@app.route('/api/classes', methods=['GET'])
def listar_classes():
    return jsonify(lista_classes)

@app.route('/api/produtos/<id_produto>/estoque', methods=['PUT'])
def atualizar_estoque_produto(id_produto):
    dados = request.get_json(silent=True) or {}
    novo_estoque = dados.get('estoque')
    
    if novo_estoque is None:
        return jsonify({"error": "Quantidade de estoque não informada"}), 400
        
    try:
        novo_estoque = int(novo_estoque)
        if novo_estoque < 0:
            return jsonify({"error": "O estoque não pode ser negativo"}), 400
    except ValueError:
        return jsonify({"error": "O estoque deve ser um número válido"}), 400

    for item in itens_catalogo:
        if item['id'] == str(id_produto):
            item['estoque'] = novo_estoque
            return jsonify({"success": True, "estoque": novo_estoque})
            
    return jsonify({"error": "Produto não encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)