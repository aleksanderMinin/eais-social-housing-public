export default({
  chart: {
   type: 'pie'
  },
  title: {
    text: ''
  },
  subtitle: {
    text: ''
  },
  plotOptions: {
    pie: {
     allowPointSelect: true,
     cursor: 'pointer',
     showInLegend: true
    },
   series: {
    dataLabels: {
      enabled: true,
      format: '{point.y:.1f} млн.'
      }
    }
  },

  tooltip: {
    enabled: false,
  },

  series: [{
    "name": "Средства на программу",
    "colorByPoint": true,
    "data": [
      {
        "name": "Оханский",
        "y": 6,
      },
      {
        "name": "Кочевский",
        "y": 6,
      },
      {
        "name": "Бардымский",
        "y": 4.5,
      },
      {
        "name": "Красновишерский",
        "y": 22,
      },
      {
        "name": "Кунгурский",
        "y": 2.8,
      },
      {
        "name": "Кизеловский",
        "y": 6,
      },
      {
        "name": "Верещагинский",
        "y": 10,
      }
    ]
  }]
});