// CONFIGURAÇÕES
const API_URL = "https://seu-backend.onrender.com";

// FUNÇÃO DE LOGIN
function fazerLogin() {
    alert("Sistema carregado!");
    // [ADICIONE AQUI O SEU CÓDIGO JAVASCRIPT]
} // CORREÇÃO: Adicionar função para buscar dados do usuário
async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar dados do usuário');
        
        const user = await response.json();
        state.user = user;
        
        // Atualizar UI
        document.getElementById('user-name').textContent = user.name;
        if(user.avatar) {
            document.getElementById('user-avatar').src = user.avatar;
        }
    } catch (err) {
        console.error(err);
    }
}

// CORREÇÃO: Melhorar a função checkForToken
function checkForToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        state.token = token;
        state.loggedIn = true;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-system').style.display = 'flex';
        
        // Carregar dados do usuário e reservas
        loadUserData();
        fetchReservations();
        fetchNotifications();
        atualizarDataHora();
        
        // Limpar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// CORREÇÃO: Adicionar tratamento de erro no fetchReservations
async function fetchReservations() {
    try {
        const response = await fetch(`${API_URL}/api/reservations`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });
        
        if (response.status === 401) {
            alert('Sessão expirada! Faça login novamente.');
            logout();
            return;
        }
        
        if (!response.ok) throw new Error('Erro ao carregar reservas');
        
        const data = await response.json();
        state.reservations = data;
        renderizarReservas();
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar reservas: ' + err.message);
    }
}

// CORREÇÃO: Função logout centralizada
function logout() {
    state.token = null;
    state.loggedIn = false;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-system').style.display = 'none';
}

// Adicionar no DOMContentLoaded:
document.getElementById('logout-btn').addEventListener('click', logout);