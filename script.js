// script.js - Buscador de CEP
document.addEventListener('DOMContentLoaded', () => {
    // 1. "Pega" todos os elementos do HTML que vamos precisar
    const cepForm = document.getElementById('cep-form');
    const cepInput = document.getElementById('cep-input');
    const loadingElement = document.getElementById('loading');
    const resultadoElement = document.getElementById('resultado');
    const enderecoElement = document.getElementById('endereco');
    const erroElement = document.getElementById('erro');

    // 2. Função principal que é executada quando o formulário é enviado
    cepForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // Pega o CEP digitado e remove espaços e traços
        const cep = cepInput.value.replace(/\D/g, '');

        // Validação básica: o CEP deve ter 8 dígitos
        if (cep.length !== 8) {
            mostrarErro('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        // Se passou na validação, esconde mensagens de erro e busca o CEP
        esconderErro();
        await buscarCEP(cep);
    });

    // 3. Função que faz a busca na API ViaCEP
    async function buscarCEP(cep) {
        mostrarLoading(); // Mostra o indicador de carregamento

        try {
            // Faz a requisição para a API
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            
            // Converte a resposta para JSON
            const dados = await response.json();

            // Verifica se a API retornou um erro (quando o CEP não existe)
            if (dados.erro) {
                throw new Error('CEP não encontrado.');
            }

            // Se deu tudo certo, mostra o resultado!
            mostrarResultado(dados);

        } catch (error) {
            // Se algo der errado na requisição (erro de rede, CEP inválido, etc.)
            mostrarErro(error.message);
        } finally {
            // Este bloco executa independente de ter dado certo ou errado
            esconderLoading();
        }
    }

    // 4. Função para mostrar o indicador de carregamento
    function mostrarLoading() {
        loadingElement.classList.remove('hidden');
        resultadoElement.classList.add('hidden');
        esconderErro();
    }

    // 5. Função para esconder o indicador de carregamento
    function esconderLoading() {
        loadingElement.classList.add('hidden');
    }

    // 6. Função para mostrar o endereço na tela
    function mostrarResultado(dados) {
        // Formata os dados do endereço em HTML
        enderecoElement.innerHTML = `
            <p><strong>CEP:</strong> ${dados.cep}</p>
            <p><strong>Logradouro:</strong> ${dados.logradouro}</p>
            <p><strong>Bairro:</strong> ${dados.bairro}</p>
            <p><strong>Cidade:</strong> ${dados.localidade}</p>
            <p><strong>Estado:</strong> ${dados.uf}</p>
            ${dados.complemento ? `<p><strong>Complemento:</strong> ${dados.complemento}</p>` : ''}
        `;

        resultadoElement.classList.remove('hidden');
    }

    // 7. Função para mostrar mensagens de erro
    function mostrarErro(mensagem) {
        erroElement.textContent = mensagem;
        erroElement.classList.remove('hidden');
        resultadoElement.classList.add('hidden');
    }

    // 8. Função para esconder mensagens de erro
    function esconderErro() {
        erroElement.classList.add('hidden');
    }
});
