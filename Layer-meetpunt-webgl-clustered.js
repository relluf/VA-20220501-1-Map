var meetpunten = ws.udr("#array").getArray();
var map = ws.qs("veldapps/Map<>").vars("map"), me = this;

var now = Date.now();
var proj = "EPSG:28992";
var RD = require("v7/openlayers/proj/RD");
var N = 77061;//meetpunten.length;//77061 //40000;
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

var source = new ol.source.Vector();
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

var clusters = new ol.source.Cluster({
	distance: 50,//parseInt(distanceInput.value, 10),
	minDistance: 30,//parseInt(minDistanceInput.value, 10),
	// projection: projection,
	source: source
});

var layer = new ol.layer.WebGLPoints({
	source: clusters,
	disableHitDetection: true,
	style: {
		symbol: {
			symbolType: 'circle',
			size: 30,
			color: ['color',
					56, 121, 217,
					// ['+', ['%', ['get', 'bedrijf'], 156], 64],
					// ['+', ['%', ['get', 'bedrijf'], 96], 80],
					// ['+', ['%', ['get', 'bedrijf'], 64], 92],
					['+', ['/', ['%', ['get', 'onderzoek'], 75], 100], 0.25]
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