const Hash = require("util/Hash");
const RD = require("veldapps-ol/proj/RD");

const uri = (c) => c.vars(["resource.uri"]);
const name = (u) => u.split("/").pop();
const numberfy = (o) => Object.keys(o).reduce((t, k) => {
	var n = o[k];
	t[k] = isNaN(n) ? n : parseInt(n, 10);
	return t;
}, {});
const stringToColor = (str) => {
    // Simple hash function to create a number from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert the hash to a hex color code
    const color = [];
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color.push(value);
    }
    
    return color;
};

// Iterate documents named Meetpunt-[...].csv
ws.qsa("devtools/Editor<>:root")

	.map(e => [name(uri(e)), e])
	.filter(e => /Meetpunt-\[.*\].csv/.test(e[0]))
	.forEach(e => {

		const now = Date.now();
		const source = new ol.source.Vector();
		const meetpunten = e[1].qs("#array").getArray();
		const features = meetpunten
			.map(mpt => [parseInt(mpt.xcoord, 10), parseInt(mpt.ycoord, 10), mpt])
			.filter(xy => !isNaN(xy[0]) && !isNaN(xy[1]))
			.map(xy => new ol.Feature(
				numberfy(js.mi({ geometry: new ol.geom.Point(xy) }, xy[2]))));

		source.addFeatures(features);

		const layer = new ol.layer.WebGLPoints({
			source: source,
			disableHitDetection: true,
			style: {
				symbol: {
					symbolType: 'circle',
					size: 7,
					color: ['color'].concat(stringToColor(e[0]))
				}
			}
		});
		this.udr("#ol-layer-needed").execute({
			parent: ws.qs("veldapps/Map<> #root-features"),
			layer: {
				layer: layer,
				// source: source,
				name: e[0]
			}
		});

		ws.print(js.sf("%s (%dms)", e[0], Date.now() - now), features);
	});













/*-

var meetpunten = ws.qsa("devtools/Editor<>:root")
	.filter(e => ["meetpunten.tsv", "meetpunten-50000.tsv"].includes(e.vars(["resource.uri"]).split("/").pop()))
	.map(c => c.qs("#array").getArray())
	.pop();

var map = ws.qs("veldapps/Map<>").vars("map"), me = this;

var now = Date.now();
var proj = "EPSG:28992";
var RD = require("veldapps-ol/proj/RD");
var N = meetpunten.length;
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
			size: 20,
			
			color: ['color',
					// 56, 121, 217,
					['+', ['%', ['get', 'bedrijf'], 156], 64],
					['+', ['%', ['get', 'bedrijf'], 96], 80],
					['+', ['%', ['get', 'bedrijf'], 64], 92],
					// ['+', ['/', ['%', ['get', 'onderzoek'], 75], 100], 0.25]
			],
			
			// color: ['color',
   //             // Calculate percentage based on 'bedrijf' value
   //             ['*',
   //                 ['+', ['%', ['get', 'onderzoek'], 156], 64], // Red channel base value
   //                 ['/',
   //                     ['%', ['get', 'bedrijf'], 100], // 'bedrijf' mod 100
   //                     100                             // Divided by 100 to get a percentage between 0 and 1
   //                 ]
   //             ],
   //             ['*',
   //                 ['+', ['%', ['get', 'onderzoek'], 96], 80],  // Green channel base value
   //                 ['/',
   //                     ['%', ['get', 'bedrijf'], 100],
   //                     100
   //                 ]
   //             ],
   //             ['*',
   //                 ['+', ['%', ['get', 'onderzoek'], 64], 92],  // Blue channel base value
   //                 ['/',
   //                     ['%', ['get', 'bedrijf'], 100],
   //                     100
   //                 ]
   //             ],
   //             1 // Alpha channel (opacity)
   //         ]
		}
	}
});
this.print("layer", layer);

source.addFeatures(features);
this.print(js.sf("features %d", Date.now() - now), features);

// map.addLayer(layer);
// "layer added";

this.udr("#ol-layer-needed").execute({
	parent: ws.qs("veldapps/Map<> #root-features"),
	layer: {
		layer: layer,
		// source: source,
		name: "meetpunten-.tsv",
	}
});

*/