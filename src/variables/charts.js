// 📊 Bar chart: Monthly Deposits (in thousands ₦)
export const barChartData = [
  {
    name: "Deposits (₦K)",
    data: [120, 95, 80, 135, 150, 110, 170, 140, 200, 160, 210, 250],
  },
];

export const barChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      backgroundColor: "#1a202c",
      fontSize: "12px",
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labels: {
      show: true,
      style: {
        colors: "#c8cfca",
        fontSize: "12px",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        colors: "#c8cfca",
        fontSize: "14px",
      },
      formatter: (val) => `₦${val}K`,
    },
  },
  grid: {
    strokeDashArray: 5,
  },
  fill: {
    colors: ["#38b2ac"],
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: "16px",
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
          },
        },
      },
    },
  ],
};

// 📈 Line chart: Income vs Expenses (₦K)
export const lineChartData = [
  {
    name: "Income (₦K)",
    data: [200, 220, 190, 240, 260, 280, 250, 300, 310, 290, 320, 350],
  },
  {
    name: "Expenses (₦K)",
    data: [180, 200, 170, 210, 230, 260, 220, 270, 280, 260, 300, 320],
  },
];

export const lineChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val) => `₦${val}K`,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    type: "category",
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labels: {
      style: {
        colors: "#c8cfca",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#c8cfca",
        fontSize: "12px",
      },
      formatter: (val) => `₦${val}K`,
    },
  },
  legend: {
    show: true,
    labels: {
      colors: "#c8cfca",
    },
  },
  grid: {
    strokeDashArray: 5,
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  colors: ["#38b2ac", "#ed8936"], // Income: teal, Expenses: orange
};
