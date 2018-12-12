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
        format: '{point.y} штук'
    }
  }
 },

 tooltip: {
   enabled: false,
 },

 series: [
   {
     "name": "Обеспечения жильем",
     "colorByPoint": true,
     "data": [
       {
         "name": "Выдано сертификатов",
         "y": 60,
       },
       {
         "name": "Реализовано сертификатов",
         "y": 5,
       },
       {
         "name": "В очереди",
         "y": 4,
       }
     ]
   }
 ]
});