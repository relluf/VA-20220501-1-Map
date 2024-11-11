"use js";

const W = ["and", ["and", 
	["isnotnull", "xcoord"], ["isnotnull", "ycoord"]], 
	["and", ["gt", "xcoord", 0], ["gt", "ycoord", 0]
]];

["veldapps/ListOf", {}, [ // clean slate
	
	[("#query"), { 
		entity: "Meetpunt",
		attributes: [
			"code", "boormeester", 
			"datum", "einddiepte", "hoogtemaaiveld", "grondwaterstand",
			"xcoord", "ycoord", "geoLatitude", "geoLongitude", 
			"onderzoek.id onderzoek", "[outer]type.id type", "[outer]situatiebeschrijving.id situ",
			"id", "created", "modified", "broId"
		],
		where: W,
		orderBy: "id desc",
		count: { where: W, orderBy: false },
		limit: 2500
	}],
	[("#menubar"), [
		["Button", {
			content: "Create CSV...",
			onTap() {
				this.setEnabled(false);
				this.setContent(locale(".loadimg"));
				this.ud("vcl/Action#query_load_all")
					.execute()
					.then(res => {
						const ws = this.up("devtools/Workspace<>:root");
						if(ws) {
							res = res.map(o => js.mi(js.mi(o._prototype), o._values));
							H("devtools/Alphaview.csv", { sel: [res]}).then(h => h.setOwner(ws));
						}
						this.setEnabled(true);
						this.revertPropertyValue("content");
					});
			}
		}]
	]]

]];