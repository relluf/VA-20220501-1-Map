const VO = require("veldoffice/VO");

VO.em.query("Meetpunt", {
	attributes: "id,code,xcoord,ycoord,geoLatitude,geoLongitude",
	where: VO.em.and([
		VO.em.or([
			VO.em.and([["notequals", "xcoord", 0], ["notequals", "ycoord", 0], ["isnotnull", "xcoord"], ["isnotnull", "ycoord"] ]),
			VO.em.and([["isnotnull", "geoLatitude"], ["isnotnull", "geoLongitude"] ])
		]),
		["gte", "created", new Date(2023, 0, 1)]
	]),
		
	orderBy: "id desc",
	page: [0, 50],
	
	raw: true
});