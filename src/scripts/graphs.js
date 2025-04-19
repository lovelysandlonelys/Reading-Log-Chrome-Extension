

import { getLogsFromFirestore } from './firebase.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch logs
  const logs = await getLogsFromFirestore();
  
  if (logs.length > 0) {
    // Calculate total words read
    let totalWordsRead = 0;
    const genreCount = {};
    const formCount = {};

    // Count genres and forms, and calculate total words read
    logs.forEach(log => {
      const genre = log.fields.genre.stringValue;
      const form = log.fields.form.stringValue;
      const wordsRead = parseInt(log.fields.wordsRead.integerValue) || 0;

      totalWordsRead += wordsRead;
      
      if (genre) {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
      if (form) {
        formCount[form] = (formCount[form] || 0) + 1;
      }
    });

    // Update total words read in the page
    document.getElementById('totalWordsRead').textContent = `Total Words Read: ${totalWordsRead}`;

    // Prepare data for Pie Charts
    const genreLabels = Object.keys(genreCount);
    const genreData = Object.values(genreCount);

    const formLabels = Object.keys(formCount);
    const formData = Object.values(formCount);

    // Generate Pie Charts
    generatePieChart('genrePieChart', genreLabels, genreData, 'Genres');
    generatePieChart('formPieChart', formLabels, formData, 'Forms');
  }
});

function generatePieChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: [
            '#FFB6C1', // pink
            '#FF69B4', // hot pink
            '#FF1493', // deep pink
            '#DA70D6', // orchid
            '#9370DB', // medium purple
            '#D8BFD8', // thistle
            '#DDA0DD', // plum
            '#EE82EE', // violet
            '#C71585', // medium violet red
            '#8B008B'  // dark magenta
          ],          
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + ' entries';
            }
          }
        }
      }
    }
  });
}
