/* global L, Papa */
var map = L.map('mapid', {
  center: L.latLng(49.4100908, 14.6805764),
  zoom: 14
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

function openFile (event) {
  Papa.parse(event.target.files[0], {
    worker: true,
    header: true,
    dynamicTyping: true,
    step: function (row) {
      if (row.data['TX Cnt'] && row.data[' Lat'] !== 360) {
        addPoint(row.data)
      }
    },
    complete: function () {
      console.log("All done!");
    }
  })
}

function addPoint (i) {
  var circle = L.circle([i[' Lat'], i[' Long']], {
    color: getColor(i[' Rssi']),
    opacity: getOpacity(i[' Rssi']),
    radius: 10
  }).addTo(map)
  const content = JSON.stringify(i, null, 2)
  circle.bindPopup(content)
}

function getColor (d) {
  return d === 0 ? 'red'
    : d > 0 && d >= -30 ? '#00ff00' // strong signal
      : d > -30 && d > -100 ? '#00aa00' // weaker signal
        : '#008800'
}

function getOpacity (d) {
  return d === 0 ? 0.5 :
         d > 0 && d >= -30 ? 1 :    // strong signal
         d > -30 && d > -100 ? 0.5 : // weaker signal
         0.3
}
