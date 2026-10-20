const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const read = name => fs.readFileSync(path.join(root, 'src', name), 'utf8');

// Modern administrative outlines only. All levels share the same projection.
const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
function simplify(points, tolerance) {
  if (points.length <= 4) return points;
  const keep = new Uint8Array(points.length), squared = tolerance * tolerance;
  keep[0] = keep[points.length - 1] = 1;
  function distance(p, a, b) {
    let [x, y] = a;
    const dx = b[0] - x, dy = b[1] - y;
    if (dx || dy) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) [x, y] = b;
      else if (t > 0) { x += dx * t; y += dy * t; }
    }
    return (p[0] - x) ** 2 + (p[1] - y) ** 2;
  }
  function step(a, b) {
    let maximum = squared, index = -1;
    for (let i = a + 1; i < b; i++) {
      const d = distance(points[i], points[a], points[b]);
      if (d > maximum) { maximum = d; index = i; }
    }
    if (index >= 0) { keep[index] = 1; step(a, index); step(index, b); }
  }
  step(0, points.length - 1);
  const result = points.filter((_, i) => keep[i]);
  return result.length < 4 ? points : result;
}
function pathOf(geometry, tolerance) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap(polygon => polygon.map(ring => {
    const coordinates = simplify(ring, tolerance).map(([lon, lat]) => [
      40 + (lon - 73) * Math.cos(35 * Math.PI / 180) * 7.4,
      40 + (merc(54) - merc(lat)) * 180 / Math.PI * 7.4
    ]);
    return 'M' + coordinates.map(p => p.map(n => +n.toFixed(5)).join(' ')).join('L') + 'Z';
  })).join('');
}
const json = name => JSON.parse(read('maps/' + name));
const mapData = {
  provinces: json('cn.json').features.map(f => ({ name: f.properties.name, code: f.properties.adcode, d: pathOf(f.geometry, .12) })),
  cities: json('hb.json').features.map(f => ({ name: f.properties.name, code: f.properties.adcode, d: pathOf(f.geometry, .006) })),
  city: pathOf(json('sjz.json').features[0].geometry, .0015),
  county: pathOf(json('zx.json').features[0].geometry, .0004),
  bridge: [114.763280, 37.720229]
};
const core = read('vendor/core.js'), renderer = read('vendor/renderer.js');
if (/<\/script/i.test(core + renderer)) throw new Error('Unexpected inline script terminator');
const htmlText = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const player = read('player.js')
  .replace('/* ENGINE_GEOMETRY */', () => read('geometry.js'))
  .replace('/* MAP_DATA */', () => JSON.stringify(mapData));
const html = read('layout.html')
  .replace('<!-- SOURCES_DIALOG -->', () => read('sources.html'))
  .replace('<!-- SCRIPTS -->', () => `<!--\n${read('vendor/THIRD_PARTY_NOTICES.md')}\n-->\n<template id="threeCore">${htmlText(core)}</template>\n<template id="threeRenderer">${htmlText(renderer)}</template>\n<script>${player}</script>`);
if (/\/\* (ENGINE_GEOMETRY|MAP_DATA) \*\/|<!-- (SOURCES_DIALOG|SCRIPTS) -->/.test(html)) throw new Error('Unresolved template marker');
const out = path.join(root, 'index.html');
fs.writeFileSync(out, html, 'utf8');
console.log(JSON.stringify({ out, bytes: Buffer.byteLength(html), mapBytes: JSON.stringify(mapData).length }));
