document.addEventListener('DOMContentLoaded', function() {
    // Limpa os campos ao carregar a página
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
    
    const loginForm = document.getElementById('loginForm');
    const btnEntrar = document.getElementById('btnEntrar');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        clearErrors();

        // Corrigido: removida a limpeza dos campos durante o submit
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        let isValid = true;

        if (!email) {
            showError('email', 'Por favor, informe seu e-mail');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Por favor, informe um e-mail válido');
            isValid = false;
        }

        if (!senha) {
            showError('senha', 'Por favor, informe sua senha');
            isValid = false;
        }

        if (!isValid) return;

        btnEntrar.disabled = true;
        btnText.textContent = 'Entrando...';
        spinner.classList.remove('hidden');

        try {
            const response = await fetch('https://back-spider.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            });

            const data = await response.json();
            console.log("Resposta da API:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            // Armazenar token e dados do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirecionar para a página principal
            window.location.href = 'home.html';

        } catch (error) {
            console.error('Erro completo:', error);
            showGlobalError(error.message.includes("credenciais") 
                ? "E-mail ou senha incorretos" 
                : "Erro no login: " + error.message);
        } finally {
            btnEntrar.disabled = false;
            btnText.textContent = 'Entrar';
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
        
        loginForm.appendChild(errorElement);
    }
});