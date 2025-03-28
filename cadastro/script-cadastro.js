document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const btnCadastrar = document.getElementById('btnCadastrar');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        clearErrors();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
        const senhaRecuperacao = document.getElementById('senhaRecuperacao').value.trim();

        let isValid = true;

        if (!nome) {
            showError('nome', 'Por favor, informe seu nome completo');
            isValid = false;
        }

        if (!email) {
            showError('email', 'Por favor, informe seu e-mail');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Por favor, informe um e-mail válido');
            isValid = false;
        }

        if (!senha) {
            showError('senha', 'Por favor, crie uma senha');
            isValid = false;
        } else if (senha.length < 4) {
            showError('senha', 'A senha deve ter pelo menos 4 caracteres');
            isValid = false;
        }

        if (!confirmarSenha) {
            showError('confirmarSenha', 'Por favor, confirme sua senha');
            isValid = false;
        } else if (senha !== confirmarSenha) {
            showError('confirmarSenha', 'As senhas não coincidem');
            isValid = false;
        }

        if (!senhaRecuperacao) {
            showError('senhaRecuperacao', 'Por favor, crie uma palavra de recuperação');
            isValid = false;
        }

        if (!isValid) return;

        btnCadastrar.disabled = true;
        btnText.textContent = 'Cadastrando...';
        spinner.classList.remove('hidden');

        try {
            const userData = {
                nome: nome,
                email: email,
                senha: senha,
                premium: "0",
                senhaRecuperacao: senhaRecuperacao,
                imagemPerfil: "https://exemplo.com/padrao.jpg" // URL padrão obrigatória
            };

            console.log("Dados enviados:", JSON.stringify(userData, null, 2));

            const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            console.log("Resposta da API:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar usuário');
            }

            alert('Cadastro realizado com sucesso!');
            window.location.href = 'home.html';

        } catch (error) {
            console.error('Erro completo:', error);
            showGlobalError(error.message.includes("já cadastrado") 
                ? "Este e-mail já está em uso" 
                : "Erro no cadastro: " + error.message);
        } finally {
            btnCadastrar.disabled = false;
            btnText.textContent = 'Cadastrar';
            spinner.classList.add('hidden');
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.style.borderBottomColor = '#e74c3c';
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        document.querySelectorAll('.form-group input').forEach(input => {
            input.style.borderBottomColor = '#ddd';
        });
        
        const globalError = document.querySelector('.global-error-message');
        if (globalError) {
            globalError.remove();
        }
    }

    function showGlobalError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'global-error-message';
        errorElement.textContent = message;
        
        const existingError = document.querySelector('.global-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        registerForm.appendChild(errorElement);
    }
});