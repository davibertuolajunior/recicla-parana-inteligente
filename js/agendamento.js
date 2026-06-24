// Função para mudar de aba
function mudarAba(aba) {
    const formBtn = document.getElementById('abaForm');
    const meusBtn = document.getElementById('abaMeus');
    const formPainel = document.getElementById('abaPainelForm');
    const meusPainel = document.getElementById('abaPainelMeus');

    if (aba === 'form') {
        formBtn.style.backgroundColor = 'var(--cor-primaria)';
        formBtn.style.color = 'white';
        meusBtn.style.backgroundColor = 'transparent';
        meusBtn.style.color = 'var(--cor-texto)';
        formPainel.style.display = 'block';
        meusPainel.style.display = 'none';
    } else {
        formBtn.style.backgroundColor = 'transparent';
        formBtn.style.color = 'var(--cor-texto)';
        meusBtn.style.backgroundColor = 'var(--cor-primaria)';
        meusBtn.style.color = 'white';
        formPainel.style.display = 'none';
        meusPainel.style.display = 'block';
        carregarAgendamentos();
    }
}

// Função para agendar coleta
function agendar(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cidade = document.getElementById('cidade').value;
    const endereco = document.getElementById('endereco').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const observacoes = document.getElementById('observacoes').value;

    const materiais = Array.from(document.querySelectorAll('input[name="materiais"]:checked'))
        .map(checkbox => checkbox.value);

    if (materiais.length === 0) {
        alert('⚠️ Selecione pelo menos um material para coleta');
        return;
    }

    // Validar data no futuro
    const dataSelecionada = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataSelecionada < hoje) {
        alert('⚠️ A data deve ser no futuro');
        return;
    }

    // Criar objeto de agendamento
    const agendamento = {
        id: Date.now(),
        nome,
        email,
        telefone,
        cidade,
        endereco,
        materiais,
        data,
        hora,
        observacoes,
        status: 'confirmado',
        dataCriacao: new Date().toISOString()
    };

    // Salvar no localStorage
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    // Mostrar mensagem de sucesso
    const mensagem = document.getElementById('mensagemAgendamento');
    mensagem.innerHTML = `
        <div class="alert alert-success">
            <h3>✅ Agendamento Confirmado!</h3>
            <p><strong>ID do Agendamento:</strong> #${agendamento.id}</p>
            <p><strong>Data:</strong> ${new Date(data).toLocaleDateString('pt-BR')} às ${hora}</p>
            <p><strong>Local:</strong> ${endereco}, ${cidade}</p>
            <p><strong>Materiais:</strong> ${agendamento.materiais.join(', ')}</p>
            <p style="margin-top: 1rem; color: #155724;">
                📧 Uma confirmação foi enviada para <strong>${email}</strong><br>
                📱 Você receberá um SMS de confirmação em <strong>${telefone}</strong>
            </p>
        </div>
    `;
    mensagem.style.display = 'block';

    // Limpar formulário
    document.getElementById('formAgendamento').reset();

    // Scroll para mensagem
    setTimeout(() => {
        mensagem.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Função para carregar agendamentos
function carregarAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const container = document.getElementById('meusAgendamentos');

    if (agendamentos.length === 0) {
        container.innerHTML = '<p class="loading">Você ainda não possui agendamentos</p>';
        return;
    }

    let html = '<h3>Seus Agendamentos</h3>';
    agendamentos.forEach(agendamento => {
        const dataFormatada = new Date(agendamento.data).toLocaleDateString('pt-BR');
        const statusClass = `status-${agendamento.status}`;
        
        html += `
            <div class="agendamento-item">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h4>Agendamento #${agendamento.id}</h4>
                        <p><strong>📍 Cidade:</strong> ${agendamento.cidade}</p>
                        <p><strong>📍 Endereço:</strong> ${agendamento.endereco}</p>
                        <p><strong>📅 Data:</strong> ${dataFormatada} às ${agendamento.hora}</p>
                        <p><strong>♻️ Materiais:</strong> ${agendamento.materiais.join(', ')}</p>
                    </div>
                    <span class="status-badge ${statusClass}">
                        ${agendamento.status === 'confirmado' ? '✓ CONFIRMADO' : 'PENDENTE'}
                    </span>
                </div>
                <button class="btn btn-secondary" onclick="cancelarAgendamento(${agendamento.id})" style="margin-top: 1rem;">Cancelar</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Função para cancelar agendamento
function cancelarAgendamento(id) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    let agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos = agendamentos.filter(a => a.id !== id);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    carregarAgendamentos();
}
