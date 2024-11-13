const VO = require("veldoffice/VO");

const meetpunt__all = (opts) => VO.em.query("Meetpunt", {
		attributes: "id,code,xcoord,ycoord,geoLatitude,geoLongitude",
		where: VO.em.and([
			VO.em.or([
				VO.em.and([["notequals", "xcoord", 0], ["notequals", "ycoord", 0], ["isnotnull", "xcoord"], ["isnotnull", "ycoord"] ]),
				VO.em.and([["isnotnull", "geoLatitude"], ["isnotnull", "geoLongitude"] ])
			]),
			["gte", "created", new Date(2023, 0, 1)]
		]),
		orderBy: "id desc",
		page: [0, -1],
		raw: true
	});
	
const Index = (Entity, period, criteria) => {

	const start = new Date();

	const syear = 2013, cyear = start.getFullYear();
	const years = Array.from({ length: cyear - syear + 1 }, (_, i) => syear + i);
	const result = {};
	
	const compile_where = (where) => {
		if(criteria && criteria.where) {
			return ["and", criteria.where, where];
		}
		return where;
	};
	
	period = `${period}:created`;

	return Promise.all(years.map(y => 
		VO.em.query(Entity, [
			period,"count:id",
			"min:modified","max:modified",
			"min:created","max:created"
		], {
			groupBy: period,
			where: compile_where(["and", 
				["gte", "created", new Date(y, 0, 1)], 
				["lt", "created", new Date(y + 1, 0, 1)]
			]),
			raw: true,
			pagesize: -1
		}).then(res => result[y] = res.map(o => js.mi({ 
			year: y, name: js.sf("%s-%02d: %s", y, o[period] + 1, o['count:id']) 
		}, o)))
	))
		.then(res => js.mi(Object.values(result).flat(), { 
			name: js.sf("%s-%s (%dms)", Entity, period, Date.now() - start.getTime())
		}));
};
Index.weeks = (Entity, where) => Index(Entity, "week", where ? {where} : {});
Index.months = (Entity, where) => Index(Entity, "month", where ? {where} : {});
Index.months("Meetpunt", ["or", ["isnull", "xcoord"], ["isnull", "ycoord"]]);
// Index.weeks("Onderzoek");