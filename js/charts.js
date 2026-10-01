// Charts & Visual Analytics for Rahisa Mehendi Art
// Implements interactive graphs requested by user:
// 1. Stain Progression & Darkness Curve (0h - 72h) comparing Organic vs Chemical
// 2. Booking Demand by Season & Wedding Months
// 3. Design Style Popularity Distribution
// 4. Interactive Live Henna Estimator & Simulator

let stainChart = null;
let bookingChart = null;
let styleChart = null;

function initHennaCharts() {
  const isChartJsAvailable = typeof Chart !== 'undefined';
  if (!isChartJsAvailable) {
    console.warn('Chart.js library not loaded yet, will retry');
    setTimeout(initHennaCharts, 500);
    return;
  }

  // Common styling tokens
  const goldPrimary = '#d4af37';
  const hennaMaroon = '#8a2816';
  const emeraldGreen = '#0f5132';
  const chemicalGray = '#888888';

  // 1. Stain Progression Line Chart (0h to 72h)
  const stainCtx = document.getElementById('stainProgressionChart');
  if (stainCtx) {
    if (stainChart) stainChart.destroy();
    stainChart = new Chart(stainCtx, {
      type: 'line',
      data: {
        labels: ['0h (Removal)', '6h', '12h', '24h', '36h', '48h (Peak)', '72h', 'Day 5', 'Day 8', 'Day 12'],
        datasets: [
          {
            label: 'Rahisa 100% Organic Henna (Natural Lawsone Oxidation)',
            data: [25, 42, 60, 82, 94, 100, 98, 92, 75, 45],
            borderColor: '#9e2a1b',
            backgroundColor: 'rgba(158, 42, 27, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#d4af37',
            pointBorderColor: '#9e2a1b',
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: 'Market Chemical Cones (Toxic PPD & Synthetic Dyes)',
            data: [90, 85, 75, 60, 48, 35, 20, 10, 0, 0],
            borderColor: '#6c757d',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false,
            tension: 0.2,
            pointBackgroundColor: '#6c757d',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: "'Outfit', sans-serif", size: 12, weight: '600' },
              color: '#332211',
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: '#3b0d11',
            titleFont: { family: "'Outfit', sans-serif", weight: 'bold' },
            bodyFont: { family: "'Outfit', sans-serif" },
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label.split('(')[0]}: ${context.parsed.y}% Stain Depth`;
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 110,
            title: {
              display: true,
              text: 'Stain Richness / Color Depth (%)',
              font: { weight: '600' }
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            title: {
              display: true,
              text: 'Time Timeline after Paste Removal',
              font: { weight: '600' }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // 2. Monthly Wedding & Festive Booking Surge
  const bookingCtx = document.getElementById('bookingDemandChart');
  if (bookingCtx) {
    if (bookingChart) bookingChart.destroy();
    bookingChart = new Chart(bookingCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Bridal Booking Inquiries',
            data: [85, 95, 45, 60, 78, 30, 25, 65, 55, 90, 100, 95],
            backgroundColor: 'rgba(158, 42, 27, 0.85)',
            borderColor: '#801c13',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Cones & Store Orders',
            data: [50, 65, 40, 52, 60, 35, 45, 80, 70, 95, 98, 88],
            backgroundColor: 'rgba(212, 175, 55, 0.85)',
            borderColor: '#cba135',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: "'Outfit', sans-serif", size: 12, weight: '600' },
              color: '#332211',
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: '#3b0d11',
            callbacks: {
              afterBody: function(tooltipItems) {
                const month = tooltipItems[0].label;
                if (['Nov', 'Dec', 'Jan', 'Feb'].includes(month)) {
                  return '⭐ Peak Royal Wedding Season - Advance Booking Required';
                } else if (['Aug', 'Oct'].includes(month)) {
                  return '✨ Teej / Karwa Chauth Festive Rush';
                }
                return '';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 110,
            title: {
              display: true,
              text: 'Demand Index (Peak = 100)',
              font: { weight: '600' }
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // 3. Design Style Popularity Doughnut Chart
  const styleCtx = document.getElementById('styleDistributionChart');
  if (styleCtx) {
    if (styleChart) styleChart.destroy();
    styleChart = new Chart(styleCtx, {
      type: 'doughnut',
      data: {
        labels: [
          'Royal Traditional Bridal',
          'Modern Arabic / Floral Flow',
          'Indo-Western & Moroccan',
          'Symmetric Mandala Art',
          'Minimalist & Finger Henna'
        ],
        datasets: [{
          data: [42, 28, 14, 10, 6],
          backgroundColor: [
            '#801c13',
            '#cba135',
            '#0e3e31',
            '#be683b',
            '#e6ca65'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: "'Outfit', sans-serif", size: 11 },
              padding: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#3b0d11',
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.parsed}% of client bookings`;
              }
            }
          }
        },
        cutout: '62%'
      }
    });
  }
}

// Interactive Live Henna Estimator (Hands, Arms, Complexity, Cones required)
function updateHennaEstimator() {
  const packageType = document.getElementById('calcPackage')?.value || 'bridal';
  const coverage = parseInt(document.getElementById('calcCoverage')?.value || '2'); // 1: Palm, 2: Wrist, 3: Mid-forearm, 4: Full elbow
  const feet = document.getElementById('calcFeet')?.checked ? 1 : 0;
  const guestCount = parseInt(document.getElementById('calcGuests')?.value || '0');

  // Base calculations
  let estimatedTimeHours = 0;
  let estimatedConesNeeded = 0;
  let estimatedCost = 0;

  if (packageType === 'bridal') {
    estimatedTimeHours = 3.5 + (coverage * 0.8) + (feet * 1.5);
    estimatedConesNeeded = 4 + (coverage * 1.5) + (feet * 2);
    estimatedCost = 4500 + (coverage * 1200) + (feet * 2500);
  } else if (packageType === 'arabic') {
    estimatedTimeHours = 1.2 + (coverage * 0.5) + (feet * 0.8);
    estimatedConesNeeded = 2 + coverage + (feet * 1.5);
    estimatedCost = 1500 + (coverage * 600) + (feet * 1200);
  } else { // guest party
    estimatedTimeHours = Math.max(2, Math.ceil(guestCount / 5));
    estimatedConesNeeded = Math.ceil(guestCount * 0.6) + 2;
    estimatedCost = 2500 + (guestCount * 250);
  }

  // Update DOM elements
  const timeEl = document.getElementById('estTimeResult');
  const conesEl = document.getElementById('estConesResult');
  const costEl = document.getElementById('estCostResult');
  const stainEl = document.getElementById('estStainResult');

  if (timeEl) timeEl.innerText = `${estimatedTimeHours.toFixed(1)} Hours`;
  if (conesEl) conesEl.innerText = `${Math.ceil(estimatedConesNeeded)} Fresh Cones`;
  if (costEl) costEl.innerText = `₹${Math.round(estimatedCost).toLocaleString('en-IN')}`;
  if (stainEl) stainEl.innerText = `10 - 14 Days (Rich Mahogany)`;
}

// Bind events on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initHennaCharts();

  // Attach simulator listeners
  const calcInputs = ['calcPackage', 'calcCoverage', 'calcFeet', 'calcGuests'];
  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateHennaEstimator);
      el.addEventListener('change', updateHennaEstimator);
    }
  });

  updateHennaEstimator();
});
