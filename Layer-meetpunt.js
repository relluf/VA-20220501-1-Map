// const proj = "EPSG:28992";
const RD = require("veldapps-ol/proj/RD");

const Hash = require("util/Hash");
const uri = (c) => c.vars(["resource.uri"]);
const name = (u) => u.split("/").pop();
const numberfy = (o) => Object.keys(o).reduce((t, k) => {
	var n = o[k];
	t[k] = isNaN(n) ? n : parseInt(n, 10);
	return t;
}, {});

const stringToColor = (str, opacity = 1) => {
    // Simple hash function to create a number from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    if(opacity === 1) {
	    // Convert the hash to a hex color code
	    let color = '#';
	    for (let i = 0; i < 3; i++) {
	        const value = (hash >> (i * 8)) & 0xFF;
	        color += ('00' + value.toString(16)).slice(-2);
	    }
	    
	    return color;
    }

    // Extract RGB values from the hash
    let r = (hash >> 16) & 0xFF;
    let g = (hash >> 8) & 0xFF;
    let b = hash & 0xFF;

    // Return the color as an RGBA string, with the specified opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};


const Styles = {
	cache: {},
	
	get: (key, factory) => Styles.cache[key] || (Styles.cache[key] = factory())
};

const csvs = ws.qsa("devtools/Editor<>:root")
	.map(e => [name(uri(e)), e])
	.filter(e => /Meetpunt-\[.*\].csv/.test(e[0]))
	.forEach(e => {

		const now = Date.now();
		const meetpunten = e[1].qs("#array").getArray();
		const features = meetpunten
			.map(mpt => [parseInt(mpt.xcoord, 10), parseInt(mpt.ycoord, 10), mpt])
			.filter(xy => !isNaN(xy[0]) && !isNaN(xy[1]))
			.map(xy => new ol.Feature(
				numberfy(js.mixIn({geometry:new ol.geom.Point(xy)}, xy[2]))));
		
		var source = new ol.source.Vector({
			// attributions: "Veldoffice meetpunten",/
			// features: features
		});
		ws.print("source", source);
		
		source.addFeatures(features);

		ws.print(js.sf("%s (%dms)", e[0], Date.now() - now), features);
		
		// map.addLayer(layer);
		// "layer added";

		const layer = this.udr("#ol-layer-needed").execute({
			parent: ws.qs("veldapps/Map<> #root-features"),
			layer: {
				// layer: layer,
				source: source,
				name: e[0],
				color: stringToColor(e[0], 0.75)
			},
		});
		
		layer.setStyle((feature, resolution) => {
			
			const zdr = RD.zoomByResolution(resolution);
			const radius = Math.max(5, Math.round(0.5 / resolution) + 4);

			return Styles.get(js.sf("%s", e[0]), () => ol.create(
				["ol:style.Style", {
					image: ["ol:style.Circle", {
						radius: radius / 1.2,// * 1.35,
						fill: ["ol:style.Fill", { color: stringToColor(e[0], 0.75) }],
						stroke: ["ol:style.Stroke", { 
							color: "white",
							width: 2
						}]
					}]
				}]));
		});


		
	});