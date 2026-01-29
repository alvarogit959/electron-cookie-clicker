document.addEventListener('DOMContentLoaded', async () => {
  await loadScores();
});

async function loadScores() {
  try {
    if (window.electronAPI && window.electronAPI.fetchScores) {
      const scores = await window.electronAPI.fetchScores();
      const scoresList = document.getElementById('scores-list');
      
      if (scoresList) {
        scoresList.innerHTML = '';
        scores.sort((a, b) => b.clicks - a.clicks);

        scores.slice(0, 10).forEach(score => {
          const li = document.createElement('li');
          li.textContent = `${score.name}: ${score.clicks} clicks`;
          scoresList.appendChild(li);
        });
      }
    }
  } catch (error) {
    console.error('Error loading scores:', error);
    const scoresList = document.getElementById('scores-list');
    if (scoresList) {
      scoresList.innerHTML = '<li>Error cargando puntuaciones</li>';
    }
  }
}