"use veldapps-ol/proj/RD";

var RD = require("veldapps-ol/proj/RD");

var numberfy = (o) => {
	return Object.keys(o).reduce((t, k) => {
		var n = o[k];
		t[k] = isNaN(n) ? n : parseInt(n, 10);
		return t;
	}, {});
};
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

var getArray = (c) => { 
	// need an API (!!!) CVLN-20210109-1 - Maker / CVLN-20220509-1-code-API
	var root = c.up("devtools/Workspace<>:root");
	// var r = root.qs("#Projects/Map/meetpunten-50000\\.tsv #array");
	var r = root.qs("#Projects/Map/meetpunten\\.tsv #array");
	if(!r) {
		r = root.qs("#Projects/Map/meetpunten\\.tsv #array");
	}
	if(!r) {
		r = root.qsa("devtools/Editor<tsv>:root")
				.map(e => [e.vars(["resource.uri"]), e])
				.filter(e => e[0].endsWith("Meetpunt-[50k].tsv") || 
				// .filter(e => e[0].endsWith("meetpunten.tsv") || 
					e[0].endsWith("meetpunten.tsv"))
				.map(e => e[1])[0]
				.qsa("#array")
				.pop();
	}
	return r && r.getArray();
};

["Container", "map-ll", {
	css: {
		".ol-control button": {
			"color": "gray", 
			"background": "rgba(155,155,155,0.45)", 
			// "left": "32px", 
			// "bottom": "32px", 
			// "padding": "8px 8px 4px 8px"
		},
		".ol-scale-line": {
			"background": "rgba(155,155,155,0.45)", 
			"left": "32px", 
			"bottom": "32px", 
			"padding": "8px 8px 4px 8px"
		},
		".ol-scale-line-inner": {
			"color": "black", 
			"font-size": "9pt",
			"font-family": "Lucida Grande, Arial, sans-serif",
			// "border-color": "rgba(55,55,55,0.5)",
			"border-color": "black",
			"border-bottom-left-radius": "3px", 
			"border-bottom-right-radius": "3px"
		},
		".ol-rotate button": "background-color: transparent; color: black;",
		".ol-dragbox": {
			"background-color": "rgba(255,255,255,0.4)",
			"border-color": "rgba(56,150,217,1)"
		}
	},
	onNodeCreated(node) { this.nextTick(() => {
		var map = new ol.Map({
			layers: [new ol.layer.Tile({ source: new ol.source.XYZ({
				url: 'https://api.maptiler.com/maps/outdoor/256/{z}/{x}/{y}@2x.png?key=' +
				'c2wFsTA4M8Wxm6exbKHQ',
				tilePixelRatio: 2, // THIS IS IMPORTANT
			}) })],
			target: node,
			view: new ol.View({
			    center: [0, 0],
			    zoom: 2
			}),
			controls: this.vars("controls") || ol.control.defaults({
		        attribution: false,
		        zoom: false,
		    }).extend([new ol.control.ScaleLine()])
		});
		
		var source = new ol.source.Vector({});
		var cluster = new ol.source.Cluster({
		distance: 10,
			source: source
		});
		var style = new ol.style.Style({
			fill: new ol.style.Fill({
			    color: "rgba(255,150,0,1)"
			}),
			stroke: new ol.style.Stroke({
			    color: "rgba(255,150,0,1)",
			    width: 1
			}),
			image: new ol.style.Circle({
			    radius: 10,
			    fill: new ol.style.Fill({
			        color: "rgba(255,150,0,1)"
			    })
			}),
			// zIndex: 1
		});

		var cache = {};
   //     var layer = new ol.layer.Vector({
			// source: cluster,
			// style: function(feature, resolution) {
			//     var size = (feature.get('features') || [1]).length;
			//     var style = cache[size];
			//     if (!style) {
			//         var color = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
			//         var radius = Math.max(8, Math.min(size * 0.75, 20));
			//         var dash = 2 * Math.PI * radius / 6;
			//         dash = [0, dash, dash, dash, dash, dash, dash];
			//         style = cache[size] = new ol.style.Style({
			//             image: new ol.style.Circle({
			//                 radius: radius,
			//                 stroke: new ol.style.Stroke({
			//                     color: "rgba(" + color + ",0.5)",
			//                     width: 15,
			//                     lineDash: dash,
			//                     lineCap: "butt"
			//                 }),
			//                 fill: new ol.style.Fill({
			//                     color: "rgba(" + color + ",1)"
			//                 })
			//             }),
			//             text: new ol.style.Text({
			//                 text: size.toString(),
			//                 //font: 'bold 12px comic sans ms',
			//                 //textBaseline: 'top',
			//                 fill: new ol.style.Fill({
			//                     color: '#fff'
			//                 })
			//             })
			//         });
			//     }
			//     return style;
			// },
			// // style: style,
			// // zIndex: 1
   //     });
		var layer = new ol.layer.WebGLPoints({
			source: source,
			disableHitDetection: true,
			style: {
				symbol: {
					symbolType: 'circle',
					size: 10,
					color: ['color',
							// 56, 121, 217,
							['+', ['%', ['get', 'bedrijf'], 156], 64],
							['+', ['%', ['get', 'bedrijf'], 96], 80],
							['+', ['%', ['get', 'bedrijf'], 64], 92],
							// ['+', ['/', ['%', ['get', 'onderzoek'], 75], 100], 0.25]
					],
					opacity: 0.9//['-', 1.0, ['*', animRatio, 0.75]],
				}
			}
		
		});
		this.print("layer", layer);
        
        this.vars("map", map);
		var arr = getArray(this)
			.map(mpt => [parseFloat(mpt.xcoord), parseFloat(mpt.ycoord), mpt])
			.filter(xy => !isNaN(xy[0]) && !isNaN(xy[1]))
			// .slice(0, 1000)
			.map(xy => xy[2]);
	    	
		arr.forEach(mpt => {
			var ll = RD.rd2ll(
					parseFloat(mpt.xcoord, 10), 
					parseFloat(mpt.ycoord, 10));
			var ft = new ol.Feature(numberfy(js.mixIn({
				geometry: new ol.geom.Point(ol.proj.fromLonLat([ll[1], ll[0]]))
			}, mpt)));
			source.addFeature(ft);
		});
		map.addLayer(layer);
		
this.print("source", source);
this.print("meetpunten", arr);
this.print("layer added", layer);

	});},
	onResize() {
		var map = this.vars("map");
		map && map.updateSize();
	}
}];