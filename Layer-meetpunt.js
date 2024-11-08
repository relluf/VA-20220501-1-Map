var meetpunten = ws.qsa("devtools/Editor<>:root")
	.filter(e => ["meetpunten.tsv", "meetpunten-50000.tsv"].includes(e.vars(["resource.uri"]).split("/").pop()))
	.map(c => c.qs("#array").getArray())
	.pop();
var map = ws.qs("veldapps/Map<>").vars("map"), me = this;

var now = Date.now();
var proj = "EPSG:28992";
var RD = require("veldapps-ol/proj/RD");
var N = meetpunten.length; //77061;
var numberfy = (o) => {
	return Object.keys(o).reduce((t, k) => {
		var n = o[k];
		t[k] = isNaN(n) ? n : parseInt(n, 10);
		return t;
	}, {});
};
var features = meetpunten.slice(meetpunten.length - N, meetpunten.length)
	.map(mpt => [parseInt(mpt.xcoord, 10), parseInt(mpt.ycoord, 10), mpt])
	.filter(xy => !isNaN(xy[0]) && !isNaN(xy[1]))
	.map(xy => new ol.Feature(
		numberfy(js.mixIn({geometry:new ol.geom.Point(xy)}, xy[2]))));

var source = new ol.source.Vector({
	// attributions: "Veldoffice meetpunten",/
	// features: features
});
this.print("source", source);

const oldColor = 'rgba(242,56,22,0.61)';
const newColor = '#ffe52c';
const period = 12;
const animRatio = [
  '^',
  [
    '/',
    [
      '%',
      [
        '+',
        ['time'],
        ['interpolate', ['linear'], ['get', 'year'], 1850, 0, 2015, period],
      ],
      period,
    ],
    period,
  ],
  0.5,
];

var layer = new ol.layer.WebGLPoints({
	source: source,
	disableHitDetection: true,
	style: {
		symbol: {
			symbolType: 'circle',
			size: 10,
			color: ['color',
					// ['+', ['%', ['get', 'bedrijf'], 96], 80],
					// ['+', ['%', ['get', 'bedrijf'], 64], 92],
					// ['+', ['%', ['get', 'bedrijf'], 32], 64],
					56, 121, 217,
					['+', ['/', 1, ['%', ['get', 'bedrijf'], 25]], 0.75]
			],
			opacity: 0.9//['-', 1.0, ['*', animRatio, 0.75]],
		}
	}

});
this.print("layer", layer);

source.addFeatures(features);
this.print(js.sf("features %d", Date.now() - now), features);

map.addLayer(layer);
"layer added";