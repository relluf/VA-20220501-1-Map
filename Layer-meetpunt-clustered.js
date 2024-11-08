var meetpunten = ws.qs("#Projects/Map/meetpunten\\.tsv #array").getArray();
var map = ws.qs("veldapps/Map<>").vars("map"), me = this;

var now = Date.now();
var proj = "EPSG:28992";
var RD = require("v7/openlayers/proj/RD");
var N = 77061;
var features = meetpunten.slice(meetpunten.length - N, meetpunten.length)
	.map(mpt => [parseInt(mpt.xcoord, 10), parseInt(mpt.ycoord, 10), mpt])
	.filter(xy => !isNaN(xy[0]) && !isNaN(xy[1]))
	.map(xy => new ol.Feature(
		js.mixIn({geometry:new ol.geom.Point(xy)}, xy[2])));

var source = new ol.source.Vector({
	// attributions: "Veldoffice meetpunten",/
	// features: features
});

var styles = {};
var Styles = {
	'default': new ol.style.Style({
		// fill: new ol.style.Fill({ color: "rgba(255, 204, 51, 0.2)"}),
		fill: new ol.style.Fill({ color: 'rgb(56, 121, 217)' }),
		// stroke: new ol.style.Stroke({ color: '#333333', width: 2 }),
		stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
		label: new ol.style.Style({
		    text: new ol.style.Text({
		        font: "12px Calibri,sans-serif",
		        overflow: true,
		        fill: new ol.style.Fill({ color: "#000" }),
		        stroke: new ol.style.Stroke({ color: "#fff", width: 3 })
		    })
		}),
		image: new ol.style.Circle({ radius: 7,
			fill: new ol.style.Fill({ color: 'rgb(56, 121, 217)' }),
			stroke: new ol.style.Stroke({ color: 'white', width: 2 })
		})
	}),
	label: new ol.style.Style({
	    text: new ol.style.Text({
	        font: "12px Calibri,sans-serif",
	        overflow: true,
	        fill: new ol.style.Fill({ color: "#000" }),
	        stroke: new ol.style.Stroke({ color: "#fff", width: 3 })
	    })
	}),
	putten: function(feature, resolution) {
		var selection = ws.qs("veldapps/Map<>").vars("map:select-interaction").getFeatures().getArray();
		var selected = selection.indexOf(feature) !== -1;

		/*- TODO style based upon editing state, dirty state, etc. */
		var z = RD.zoomByResolution(resolution);
		var radius = Math.round(0.5 / resolution) + 4;
		// var edited = te.vars("edited") || [];
		// var dirty = EM.isDirty(meetpunt) || edited.indexOf(feature) !== -1;// || (isNaN(meetpunt.xcoord) || isNaN(meetpunt.y));
		var dirty = false;
		var styles = FeatureStyles[dirty ? "dirty" : "normal"];
		
		if(radius < 4) radius = 4;
		
		if(!styles[radius]) {
			styles[radius] = (ol.convert(["ol:style.Style", {
				image: ["ol:style.Circle", { 
					radius: radius * 1.35, 
					fill: ["ol:style.Fill", { color: dirty ? "red" : "rgba(255, 204, 51, 1)" }],//rgba(86, 244, 66, 0.7)" }],
					stroke: ["ol:style.Stroke", { color: dirty ? "rgb(56, 121, 217)" : "black", width: z > 5 ? 2 : 1 }]
				}]
			}]));
		}
	
		var text = FeatureStyles.label.getText();
		text.setText(feature.get("code"));
		text.setOffsetY(resolution > 0.04 ? radius + 8 : 0);
		
		if(selected) {
			return [Styles.label, Styles.default];
		}
	
		return resolution < 7 ? 
			[FeatureStyles.label, styles[radius]] : 
			[styles[radius]];

	},
	gebieden: new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(0,155,0,0.85)" }),
		stroke: new ol.style.Stroke({ color: "black", width: 2 })
	})
};
var FeatureStyles = {
	normal: [], dirty: [], 
	'default': Styles['default'],
	putten: Styles.putten,
	label: Styles.label,
	interaction: {
		select: Styles.putten
	},
	gebieden: Styles.gebieden
};

this.print("source", source);

var clusters = new ol.source.Cluster({
	distance: 50,//parseInt(distanceInput.value, 10),
	minDistance: 30,//parseInt(minDistanceInput.value, 10),
	// projection: projection,
	source: source
});
this.print("clusters", clusters);

var cache = {};
var layer = new ol.layer.Vector({
	source: clusters,
	zIndex: 1,
	style: function(feature, resolution) {
	    var size = feature.get('features').length;
	    var style = cache[size];
	    if (!style) {
	        var color = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
	        var radius = Math.max(8, Math.min(size * 0.75, 20));
	        var dash = 2 * Math.PI * radius / 6;
	        dash = [0, dash, dash, dash, dash, dash, dash];
	        style = cache[size] = new ol.style.Style({
	            image: new ol.style.Circle({
	                radius: radius,
	                stroke: new ol.style.Stroke({
	                    color: "rgba(" + color + ",0.5)",
	                    width: 15,
	                    lineDash: dash,
	                    lineCap: "butt"
	                }),
	                fill: new ol.style.Fill({
	                    color: "rgba(" + color + ",1)"
	                })
	            }),
	            text: new ol.style.Text({
	                text: size.toString(),
	                //font: 'bold 12px comic sans ms',
	                //textBaseline: 'top',
	                fill: new ol.style.Fill({
	                    color: '#fff'
	                })
	            })
	        });
	    }
	    return style;
	}	
});

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

// var layer = new ol.layer.WebGLPoints({
// 	source: source,
// 	disableHitDetection: true,
// 	style: {
// 		symbol: {
// 			symbolType: 'circle',
// 			size: 10,
// 			color: ['color',
// 					['+', ['%', ['get', 'bedrijf'], 96], 80],
// 					['+', ['%', ['get', 'bedrijf'], 64], 92],
// 					['+', ['%', ['get', 'bedrijf'], 156], 64],
// 					['+', ['/', 1, ['%', ['get', 'bedrijf'], 25]], 0.75]
// 			],
// 			opacity: 0.9//['-', 1.0, ['*', animRatio, 0.75]],
// 		}
// 	}

// });

// map.on('click', (e) => {
// 	clusters.getFeatures(e.pixel).then((clickedFeatures) => {
// 		if (clickedFeatures.length) {
// 			// Get clustered Coordinates
// 			const features = clickedFeatures[0].get('features');
// 			if (features.length > 1) {
// 				const extent = boundingExtent(
// 					features.map((r) => r.getGeometry().getCoordinates())
// 				);
// 				map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
// 			}
// 		}
// 	});
// });

this.print("layer", layer);

source.addFeatures(features);

this.print(js.sf("features %d", Date.now() - now), features);

map.addLayer(layer);
"layer added";

