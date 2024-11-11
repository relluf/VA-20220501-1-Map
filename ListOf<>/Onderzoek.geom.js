"use js";

["veldapps/ListOf<>", {}, [ // clean slate
	
	[("#query"), {
		entity: "Onderzoek",
		attributes: [
			"projectcode", "naam", //"projectleider", 
			"id", "created", "modified",//, "broId"
			"bedrijf.id", "contour"
		],
		orderBy: "id desc",
		where: ["isnotnull", "contour"],
		count: true,
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