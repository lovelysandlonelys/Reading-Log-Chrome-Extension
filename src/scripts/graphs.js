import { getLogsFromFirestore } from './firebase.js';
import { auth } from './firebase.js';

document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      console.error("❌ User not authenticated. Graphs cannot be generated.");
      document.getElementById('totalWordsRead').textContent = "Please log in to view your stats.";
      return;
    }

    console.log("✅ User is authenticated:", user);

    try {
      // Fetch logs
      const logs = await getLogsFromFirestore();
      console.log("📊 Logs fetched for graphs:", logs);

      if (!logs || logs.length === 0) {
        console.warn("⚠️ No logs found. Graphs will not be generated.");
        document.getElementById('totalWordsRead').textContent = "No data available to display graphs.";
        return;
      }

      // Initialize counters
      let totalWordsRead = 0;
      const genreCount = {};
      const formCount = {};

      // Process logs to calculate totals and counts
      logs.forEach(log => {
        const genre = log.fields.genre?.stringValue || "Unknown";
        const form = log.fields.form?.stringValue || "Unknown";
        const wordsRead = parseInt(log.fields.wordsRead?.integerValue || 0, 10);

        totalWordsRead += wordsRead;

        // Count genres
        genreCount[genre] = (genreCount[genre] || 0) + 1;

        // Count forms
        formCount[form] = (formCount[form] || 0) + 1;
      });

      // Update total words read in the page
      const totalWordsElement = document.getElementById('totalWordsRead');
      if (totalWordsElement) {
        totalWordsElement.textContent = `Total Words Read: ${totalWordsRead}`;
      }

      // Prepare data for Pie Charts
      const genreLabels = Object.keys(genreCount);
      const genreData = Object.values(genreCount);

      const formLabels = Object.keys(formCount);
      const formData = Object.values(formCount);

      // Generate Pie Charts
      generatePieChart('genrePieChart', genreLabels, genreData, 'Genres');
      generatePieChart('formPieChart', formLabels, formData, 'Forms');
    } catch (error) {
      console.error("🔥 Error generating graphs:", error);
      document.getElementById('totalWordsRead').textContent = "Error loading data for graphs. Please try again later.";
    }
  });
});

function generatePieChart(canvasId, labels, data, label) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    console.error(`🔥 Error: Canvas with ID "${canvasId}" not found.`);
    return;
  }

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: generateColors(data.length),
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw} entries`;
            }
          }
        }
      }
    }
  });
}

function generateColors(count) {
  const colors = [
    '#28002b', // Dark purple (matches activity bar background)
    '#4a004d', // Slightly lighter purple
    '#6e0070', // Medium purple
    '#900093', // Bright purple
    '#b300b6', // Vibrant purple
    '#d500d9', // Light purple
    '#edfff1', // Light green (matches title bar foreground)
    '#a8ffcc', // Soft green
    '#70ffb3', // Bright green
    '#38ff99'  // Vibrant green
  ];
  const generatedColors = [];
  for (let i = 0; i < count; i++) {
    generatedColors.push(colors[i % colors.length]); // Cycle through colors if count exceeds the palette
  }
  return generatedColors;
}
