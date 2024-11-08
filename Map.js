"use locale!./locales/en-US";

// var title = app.qs("devtools/Main<> #title");
// title.setContent("&nbsp; <b>BodemXmlTools<b> <i class='fa fa-caret-down'></i>  &nbsp;");
// title.toggleClass("smdl");

["veldapps/Map", {}, [

	[("#root-features"), { visible: false }],
	[("#root-layers"), { classes: "", expanded: false }],
	
	[("#tree"), [
		// ["Node", ("node-menu"), { 
		// 	css: {
		// 		'.fa': "cursor:pointer;",
		// 		'.pin-r': {
		// 			'': "margin-top: 0px; position: absolute; right: 12px;",
		// 			'.fa': "margin-left: 5px;",
		// 			'.fa-home': "margin-top: 6px; font-size: 14px;",
		// 			'.fa-object-group': "font-size:smallest;"
		// 		},
		// 		'.pin-l': {
		// 			'': "margin-top: 5px; position: absolute; left: 12px;",
		// 			'.fa': "margin-right: 3px;"
		// 		},
		// 		'.text': {
		// 			'': "display: flex;",
		// 			'input': "flex: 1; padding: 5px; border-radius: 5px; border: none; background: rgba(255,255,255,0.2); padding-left: 24px; padding-right: 24px; transition: width 0.5s; width: 150px;",
		// 			'input:not(:focus)': "background-color:rgba(255,255,255,0.2);",
		// 			'input:focus': "width: 300px;"
		// 		},
		// 		'.icon': "display: none;"
		// 	},
		// 	index: 0, 
		// 	text: "<span class='pin-l'><i title='⌘Escape' class='fa fa-bars'></i></span><input><span class='pin-r'><i title_='⇧⌘H' class='fa fa-home'></i><i title='⌘/' class='fa fa-search'></i></span>",
		// 	onTap(evt) { 
		// 		if(evt.target.classList.contains("fa-bars")) {
		// 			this.ud("#toggle-tree").execute();
		// 		} else if(evt.target.classList.contains("fa-home")) {
		// 			// this.ud("#home").execute();
		// 			var view = this.vars(["view"]);
		// 			this.vars(["map"]).getView().animate(view[1], 1450);
		// 		} else if(evt.target.classList.contains("fa-search")) {
		// 			var input = this.getNode().qs("input");
		// 			if(!input.value.length) {
		// 				input.focus();
		// 			} else {
		// 				this.udr("Features<> #search").execute({ sender: this });
		// 			}
		// 		}
		// 	},
		// 	onKeyPress(evt) { 
		// 		if(evt.keyCode === 27) {
		// 			this.ud("#toggle-tree").execute();
		// 		} else if(evt.keyCode === 13) { 
		// 			this.udr("Features<> #search").execute({ sender: this });
		// 		}
		// 	}
		// }]
	]]
	
	
]];