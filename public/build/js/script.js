// All javascript code in this project for now is just for demo DON'T RELY ON IT

const random = (max = 100) => {
  return Math.round(Math.random() * max) + 20
}

const randomData = () => {
  return [
    random(),
    random(),
    random(),
    random(),
    random(),
    random(),
    random(),
    random(),
    random(),
    random(),
    random(),
    random(),
  ]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const cssColors = (color) => {
  return getComputedStyle(document.documentElement).getPropertyValue(color)
}

const getColor = () => {
  return window.localStorage.getItem('color') ?? 'cyan'
}

const colors = {
  primary: cssColors(`--color-${getColor()}`),
  primaryLight: cssColors(`--color-${getColor()}-light`),
  primaryLighter: cssColors(`--color-${getColor()}-lighter`),
  primaryDark: cssColors(`--color-${getColor()}-dark`),
  primaryDarker: cssColors(`--color-${getColor()}-darker`),
}

const barChart = new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: months,
    datasets: [
      {
        data: randomData(),
        backgroundColor: colors.primary,
        hoverBackgroundColor: colors.primaryDark,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          gridLines: false,
          ticks: {
            beginAtZero: true,
            stepSize: 50,
            fontSize: 12,
            fontColor: '#97a4af',
            fontFamily: 'Open Sans, sans-serif',
            padding: 10,
          },
        },
      ],
      xAxes: [
        {
          gridLines: false,
          ticks: {
            fontSize: 12,
            fontColor: '#97a4af',
            fontFamily: 'Open Sans, sans-serif',
            padding: 5,
          },
          categoryPercentage: 0.5,
          maxBarThickness: '10',
        },
      ],
    },
    cornerRadius: 2,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
  },
})

const doughnutChart = new Chart(document.getElementById('doughnutChart'), {
  type: 'doughnut',
  data: {
    labels: ['Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [random(), random(), random()],
        backgroundColor: [colors.primary, colors.primaryLighter, colors.primaryLight],
        hoverBackgroundColor: colors.primaryDark,
        borderWidth: 0,
        weight: 0.5,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
    },

    title: {
      display: false,
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  },
})

const humChart = new Chart(document.getElementById('activeUsersChart'), {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: colors.primary,
        borderWidth: 0,
        categoryPercentage: 1,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          display: false,
          gridLines: false,
          startAtZero: true,
          beginAtZero: true,
        },
      ],
      xAxes: [
        {
          display: false,
          gridLines: false,
        },
      ],
      ticks: {
        padding: 10,
      },
    },
    cornerRadius: 2,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      prefix: 'Humidity: ',
      bodySpacing: 4,
      footerSpacing: 4,
      hasIndicator: true,
      mode: 'index',
      intersect: true,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  },
})

const tempChart = new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: colors.primary,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: false,
          startAtZero: true,
          beginAtZero: true,
          ticks: {
            beginAtZero: false,
            stepSize: 50,
            fontSize: 12,
            fontColor: '#97a4af',
            fontFamily: 'Open Sans, sans-serif',
            padding: 20,
          },
        },
      ],
      xAxes: [
        {
          gridLines: false,
        },
      ],
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      hasIndicator: true,
      intersect: false,
    },
  },
})

let humValue = 0

const usersCount = document.getElementById('usersCount')
const tempCount = document.getElementById('tempCount');

const evtSource = new EventSource("https://api.1layar.com/api/v1/watch");

let countHum = 0
let countTemp = 0

evtSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  const now = new Date();
  const formattedDate = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear().toString().slice(-2)} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  console.log(`Current Time: ${formattedDate}`);
  if(data && data.hum) {
    humValue = data.hum;
    humChart.data.datasets[0].data.push(humValue);
    humChart.data.labels.push(formattedDate);
    usersCount.innerText = `${humValue}%`;

    if (countHum > 10) {
      humChart.data.datasets[0].data.shift();
      humChart.data.labels.shift();

      countHum -= 1
    }
    
    countHum += 1
    humChart.update();
  }

  if (data && data.temp) {
    temValue = data.temp
    tempChart.data.datasets[0].data.push(temValue);
    tempChart.data.labels.push(formattedDate);
    tempCount.innerText = `${temValue}°C`;

    if (countTemp > 20) {
      tempChart.data.datasets[0].data.shift();
      tempChart.data.labels.shift();

      countTemp -= 1
    }
    
    countTemp += 1
    tempChart.update();
  }
}

