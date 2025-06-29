function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.width = (sidebar.style.width === '250px') ? '0' : '250px';
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.width = '0';
}
const activities = [
    { name: "6 Botellas de Vidrio", points: 250 },
    { name: "10 Botellas de Plástico", points: 200 },
    { name: "Recoger Basura en el Parque", points: 150 },
    { name: "Plantar un Árbol", points: 300 },
    { name: "Limpiar la Playa", points: 180 },
    { name: "Separar Residuos", points: 120 },
    { name: "Participar en Campaña de Reciclaje", points: 220 },
    { name: "Voluntariado en Centro de Reciclaje", points: 400 },
    { name: "Organizar Evento Ambiental", points: 350 },
    { name: "Reciclar Electrónicos", points: 300 },
    { name: "Promover Uso de Bolsas Reutilizables", points: 180 }
];

let totalPoints = 0;
let completed = new Set();

// Cargar datos de localStorage
function loadProgress() {
    const savedPoints = localStorage.getItem('totalPoints');
    const savedCompleted = localStorage.getItem('completedActivities');
    totalPoints = savedPoints ? parseInt(savedPoints) : 0;
    completed = savedCompleted ? new Set(JSON.parse(savedCompleted)) : new Set();
}

// Guardar datos en localStorage
function saveProgress() {
    localStorage.setItem('totalPoints', totalPoints);
    localStorage.setItem('completedActivities', JSON.stringify(Array.from(completed)));
}

function renderActivities() {
    const list = document.getElementById('activities-list');
    list.innerHTML = '';
    activities.forEach((act, idx) => {
        const div = document.createElement('div');
        div.className = 'activity';
        div.innerHTML = `
            <h3>${act.name}</h3>
            <p>Recompensa: ${act.points} puntos</p>
            <button class="collect-btn" data-idx="${idx}" ${completed.has(idx) ? 'disabled' : ''}>
                ${completed.has(idx) ? '¡Completado!' : 'Recolectar Puntos'}
            </button>
        `;
        list.appendChild(div);
    });
}

function collectPoints(idx) {
    if (!completed.has(idx)) {
        totalPoints += activities[idx].points;
        completed.add(idx);
        updatePoints();
        renderActivities();
        animatePoints();
        checkCongrats();
        saveProgress(); // Guardar progreso
    }
}

function updatePoints() {
    document.getElementById('total-points').textContent = totalPoints;
}

function animatePoints() {
    const points = document.getElementById('total-points');
    points.classList.add('animate');
    setTimeout(() => points.classList.remove('animate'), 500);
}

function checkCongrats() {
    const msg = document.getElementById('congrats-message');
    if (totalPoints >= 1000) {
        msg.textContent = "¡Felicidades! Has superado los 1000 puntos. ¡Sigue ayudando al planeta!";
        msg.classList.remove('hidden');
    } else {
        msg.classList.add('hidden');
    }
}

// Actualizar el contador de puntos al cargar la página
window.onload = function () {
    loadProgress(); // Cargar progreso al iniciar
    renderActivities();
    updatePoints();
    checkCongrats();
    document.getElementById('activities-list').addEventListener('click', e => {
        if (e.target.classList.contains('collect-btn')) {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            collectPoints(idx);
        }
    });
    document.getElementById('reset-points').addEventListener('click', () => {
        totalPoints = 0;
        completed.clear();
        updatePoints();
        renderActivities();
        checkCongrats();
        saveProgress(); // Guardar progreso al reiniciar
    });
    document.getElementById('export-json').addEventListener('click', () => {
        const data = {
            totalPoints: totalPoints,
            completed: Array.from(completed)
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'progreso.json';
        a.click();
        URL.revokeObjectURL(url);
    });
};