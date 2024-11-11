const VO = require("veldoffice/VO");

const pr = (label, value) => this.print(label, value);

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
		page: [0, 5000],
		
		raw: true
	});
const meetpunt__Index_week_created = () => {
	const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
	const result = {};
	
	return Promise.all(years.map(y => 
		VO.em.query("Meetpunt", "week:created week,count:id n,min:modified,max:modified", {
			groupBy: "week:created",
			where: ["and", 
				["gte", "created", new Date(y, 0, 1)], 
				["lt", "created", new Date(y + 1, 0, 1)]
			],
			raw: true,
			pagesize: -1
		}).then(res => result[y] = res.map(o => js.mi({ 
			year: y, name: js.sf("%s: %s", o.week + 1, o.n) 
		}, o)))
	)).then(res => result);
};

async function queryAllPages(entity, attributes, criteria) {
	/**
	 * Fetches all pages of data using a paginated query.
	 *
	 * @param {string} entity - The entity to query.
	 * @param {Array<string>} attributes - The attributes to select.
	 * @param {Object} criteria - The criteria for querying, supports paging with { page: [page, size] }.
	 * @returns {Promise<Array<Object>>} - A promise that resolves with all results across all pages.
	 */

    const allResults = [];
    let currentPage = criteria.page ? criteria.page[0] : 0;
    const pageSize = criteria.page ? criteria.page[1] : 10;

    while (true) {
        // Clone the criteria and set the page parameters
        const pageCriteria = { ...criteria, page: [currentPage, pageSize] };

        // Fetch the current page of results
        const results = await query(entity, attributes, pageCriteria);
        
pr("page-" + currentPage, results);

        // Accumulate the results
        allResults.push(...results);

        // Check if there are fewer results than the page size, indicating the last page
        if (results.length < pageSize) break;

        // Move to the next page
        currentPage += 1;
    }

    return allResults;
}



VO.em.query("Onderzoek")





this.__NO_VALUE__;