const socket = io();

const loginContainer = document.getElementById('login-container');
const gameContainer = document.getElementById('game-container');
const usernameInput = document.getElementById('username');
const joinBtn = document.getElementById('join-btn');

const moderatorControls = document.getElementById('moderator-controls');
const cardConfigInput = document.getElementById('card-config');
const updateConfigBtn = document.getElementById('update-config-btn');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

const statusMessage = document.getElementById('status-message');
const table = document.getElementById('table');
const results = document.getElementById('results');
const averageValueSpan = document.getElementById('average-value');
const maxValueSpan = document.getElementById('max-value');
const minValueSpan = document.getElementById('min-value');
const modeValueSpan = document.getElementById('mode-value');
const cardPicker = document.getElementById('card-picker');
const cardsContainer = document.getElementById('cards-container');

let myId = null;
let isModerator = false;
let currentPhase = 'waiting';
let currentCards = [];
let selectedVote = null;

joinBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        socket.emit('join', username);
        loginContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
    }
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinBtn.click();
});

updateConfigBtn.addEventListener('click', () => {
    const newCards = cardConfigInput.value.split(',').map(c => c.trim());
    socket.emit('updateConfig', newCards);
});

startBtn.addEventListener('click', () => {
    socket.emit('startSession');
});

resetBtn.addEventListener('click', () => {
    socket.emit('reset');
});

socket.on('connect', () => {
    myId = socket.id;
});

socket.on('role', (role) => {
    isModerator = (role === 'moderator');
    if (isModerator) {
        moderatorControls.classList.remove('hidden');
    } else {
        moderatorControls.classList.add('hidden');
    }
});

socket.on('initData', (data) => {
    currentPhase = data.currentPhase;
    currentCards = data.currentCards;
    cardConfigInput.value = currentCards.join(', ');
    renderCardPicker();
    updatePhaseUI();
});

socket.on('configUpdated', (newCards) => {
    currentCards = newCards;
    cardConfigInput.value = currentCards.join(', ');
    renderCardPicker();
});

let lastVotes = null;

socket.on('updateUsers', (users) => {
    table.innerHTML = '';
    users.forEach(user => {
        const slot = document.createElement('div');
        slot.className = 'player-slot';
        slot.dataset.id = user.id;
        
        const card = document.createElement('div');
        card.className = 'card face-down';
        if (user.hasVoted) {
            card.classList.add('voted');
            if (user.id === socket.id && selectedVote) {
                card.textContent = selectedVote;
                card.classList.remove('face-down');
                card.classList.add('face-up');
            } else {
                card.textContent = '?';
            }
        }
        
        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = user.username + (user.id === socket.id ? ' (Tú)' : '');
        if (user.id === socket.id && isModerator) name.textContent += ' [Mod]';

        const status = document.createElement('div');
        status.className = 'player-status ' + (user.hasVoted ? 'status-voted' : 'status-pending');
        status.textContent = user.hasVoted ? 'Votado' : 'Pendiente';

        slot.appendChild(card);
        slot.appendChild(name);
        slot.appendChild(status);
        table.appendChild(slot);
    });
    
    if (currentPhase === 'revealed' && lastVotes) {
        renderRevealedCards(lastVotes);
    }
});

socket.on('sessionStarted', () => {
    currentPhase = 'voting';
    selectedVote = null;
    lastVotes = null;
    results.classList.add('hidden');
    updatePhaseUI();
});

socket.on('reveal', (votes) => {
    lastVotes = votes;
    currentPhase = 'revealed';
    updatePhaseUI();
    renderRevealedCards(votes);
});

socket.on('resetSession', () => {
    currentPhase = 'waiting';
    selectedVote = null;
    lastVotes = null;
    results.classList.add('hidden');
    updatePhaseUI();
});

function updatePhaseUI() {
    if (currentPhase === 'waiting') {
        statusMessage.textContent = 'Esperando a que el moderador inicie la sesión...';
        cardPicker.classList.add('hidden');
        if (isModerator) startBtn.classList.remove('hidden');
    } else if (currentPhase === 'voting') {
        statusMessage.textContent = '¡Votación en curso!';
        cardPicker.classList.remove('hidden');
        renderCardPicker();
        startBtn.classList.add('hidden');
    } else if (currentPhase === 'revealed') {
        statusMessage.textContent = 'Resultados de la votación';
        cardPicker.classList.add('hidden');
        if (isModerator) startBtn.classList.remove('hidden');
    }
}

function renderCardPicker() {
    cardsContainer.innerHTML = '';
    currentCards.forEach(val => {
        const card = document.createElement('div');
        card.className = 'selectable-card';
        if (selectedVote === val) card.classList.add('selected');
        card.textContent = val;
        card.onclick = () => {
            if (currentPhase === 'voting') {
                selectedVote = val;
                socket.emit('vote', val);
                renderCardPicker();
            }
        };
        cardsContainer.appendChild(card);
    });
}

function renderRevealedCards(votes) {
    const numericVotes = [];
    let hasNonNumeric = false;

    const slots = table.querySelectorAll('.player-slot');
    slots.forEach(slot => {
        const id = slot.dataset.id;
        const val = votes[id];
        const card = slot.querySelector('.card');
        
        if (val !== undefined) {
            card.textContent = val;
            card.classList.remove('face-down');
            card.classList.add('face-up');
            
            const num = parseFloat(val);
            if (!isNaN(num)) {
                numericVotes.push(num);
            } else {
                hasNonNumeric = true;
            }
        } else {
            card.textContent = '-';
            card.classList.remove('face-down');
            card.classList.add('face-up');
        }
    });

    if (numericVotes.length > 0 && !hasNonNumeric) {
        const sum = numericVotes.reduce((a, b) => a + b, 0);
        const avg = sum / numericVotes.length;
        averageValueSpan.textContent = avg.toFixed(2);

        const max = Math.max(...numericVotes);
        const min = Math.min(...numericVotes);
        maxValueSpan.textContent = max;
        minValueSpan.textContent = min;

        // Calculate Mode
        const frequencies = {};
        let maxFreq = 0;
        numericVotes.forEach(v => {
            frequencies[v] = (frequencies[v] || 0) + 1;
            if (frequencies[v] > maxFreq) maxFreq = frequencies[v];
        });
        const modes = Object.keys(frequencies).filter(v => frequencies[v] === maxFreq);
        modeValueSpan.textContent = modes.join(', ');

        results.classList.remove('hidden');
    } else {
        results.classList.add('hidden');
    }
}
