document.getElementById("gpxFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const gpx = new gpxParser();
    gpx.parse(reader.result);

    const points = gpx.tracks[0].points.map(p => [p.lon, p.lat]);
    const name = gpx.tracks[0].name || file.name.replace(".gpx", "");

    drawTrack(points, name);
  };
  reader.readAsText(file);
});

document.getElementById("bgColor").addEventListener("input", function () {
  document.getElementById("paper").style.backgroundColor = this.value;
});

function drawTrack(points, name) {
  const svg = document.getElementById("svgTrack");
  svg.innerHTML = ""; // Clear previous

  const width = svg.clientWidth;
  const height = svg.clientHeight;

  const lons = points.map(p => p[0]);
  const lats = points.map(p => p[1]);
  const minX = Math.min(...lons);
  const maxX = Math.max(...lons);
  const minY = Math.min(...lats);
  const maxY = Math.max(...lats);

  const padding = 40;
  const scaleX = (width - padding * 2) / (maxX - minX);
  const scaleY = (height - padding * 2) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (width - (maxX - minX) * scale) / 2;
  const offsetY = (height - (maxY - minY) * scale) / 2;

  const pathData = points
    .map(([lon, lat], i) => {
      const x = (lon - minX) * scale + offsetX;
      const y = height - ((lat - minY) * scale + offsetY); // flip Y
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#FC4C02");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("vector-effect", "non-scaling-stroke");

  // Optional: smooth line (spline effect)
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  svg.appendChild(path);

  document.getElementById("trackName").textContent = name;
}
