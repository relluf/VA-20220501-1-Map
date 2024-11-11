// "use locale!./locales/nl";

window.locale.loc = "nl";

function collectGeometries(feature) {

	if(feature instanceof Array) {
		return feature.map(ft => collectGeometries(ft)).flat();
	}

    const geometries = [];
    // Helper function to recursively collect geometries
    function collectGeometries_(geometry) {
        const geometryType = geometry.getType();

        // Handle GeometryCollection or multi-geometries like MultiPolygon
        if (geometryType === 'GeometryCollection') {
            // If it's a GeometryCollection, recursively collect all sub-geometries
            geometry.getGeometries().forEach(function(geom) {
                collectGeometries_(geom);  // Recursion for each geometry in the collection
            });
        } else if (geometryType === 'MultiPolygon') {
            // If it's a MultiPolygon, collect each Polygon inside it
            geometry.getPolygons().forEach(function(polygon) {
                geometries.push(polygon);  // Add each polygon
            });
        } else if (geometryType === 'MultiPoint') {
            // If it's a MultiPoint, collect each Point inside it
            geometry.getPoints().forEach(function(point) {
                geometries.push(point);  // Add each point
            });
        } else if (geometryType === 'MultiLineString') {
            // If it's a MultiLineString, collect each LineString inside it
            geometry.getLineStrings().forEach(function(lineString) {
                geometries.push(lineString);  // Add each line string
            });
        } else {
            // For simple geometries (Point, LineString, Polygon, etc.)
            geometries.push(geometry);
        }
    }

    // Start with the feature's geometry
    collectGeometries_(feature.getGeometry());

    return geometries;  // Return the flattened array of geometries
}

["veldapps/Map", {
	handlers: {
		'map:ready'(map) {
			map.on("click", (evt) => {
				// if(!allowClicks(evt, status)) return;
				
				this.setTimeout("click", () => {
					const z = map.getView().getZoom(), maxZoom = 17;
					const features = map.getFeaturesAtPixel(evt.pixel);
					const geometries = collectGeometries(features)
						.filter(geom => ol.extent.containsCoordinate(
							geom.getExtent(), 
							evt.coordinate));

					let newZoom = z < maxZoom ? z + 5 : maxZoom;
				    let extent = ol.extent.createEmpty();

					if(geometries.length === 1) {
						
						ol.extent.extend(extent, geometries[0].getExtent());
						
					} else if (features && features.length) {
					    // Initialize an empty extent

					    if (evt.originalEvent.altKey === true) {
					        while (features.length > 1) features.splice(1);
					    }
					
				        features.forEach(feature => {
				            const geom = feature.getGeometry(), type = geom.getType();
				            if(type === "GeometryCollection") {
				            	const geoms = geom.getGeometries();
				            	geoms.forEach((g, i) => {
				            		if(ol.extent.containsCoordinate(g.getExtent(), evt.coordinate)) {
				            			ol.extent.extend(extent, g.getExtent());
				            		}
				            	});
				            } else {
				            	ol.extent.extend(extent, geom.getExtent()); // Extend the current extent with each feature's geometry
				            }
				        });

					}
					// Fit the map's view to the calculated extent
					map.getView().fit(extent, { 
						duration: 725, 
						maxZoom: 15,
				        padding: [50, 50, 50, 50] });
				}, 350);
			});
			map.on("dblclick", (evt) => {
				if(!allowClicks(evt, status)) return;
				
				this.clearTimeout("click");
				
				function foo() {
					const features = map.getFeaturesAtPixel(evt.pixel) || [];
					const geometries = collectGeometries(features);
					const clicked_geoms = geometries
						.filter(geom => ol.extent.containsCoordinate(
							geom.getExtent(), 
							evt.coordinate));
					
					if(clicked_geoms.length === 1) {
						const index = geometries.indexOf(clicked_geoms[0]);
						var selected = features[0].get("selected") || [];
						
						if(selected.includes(index)) {
							selected.splice(selected.indexOf(index), 1); 
						} else {
							selected.push(index);
						}
						
						features[0].set("selected", selected);
						vlayer_cont.changed();
						delete_geoms.setEnabled(selected.length > 0);
					}
	        		
	        		const onderzoek = this.vars(["veldoffice/Onderzoek"]);
					features
						.map(feature => feature.get("meetpunt")).filter(Boolean)
						.forEach(meetpunt => window.open(js.sf(
							"https://veldoffice.nl/#/onderzoek/%s/meetpunt/%s", 
							onderzoek.id, meetpunt.id))); 
				}
	
        		evt.stopPropagation();
				evt.preventDefault();
			});
		}
	},
	vars: {
		'do-not-select': true
	}
}, [

	[("#root-layers"), { classes: "", expanded: true }],
	[("#root-features"), { visible: true, expanded: true }],
	[("#root-features-selected"), { visible: false }],
	
	[("#tree")]
	
]];