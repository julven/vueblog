const Router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes: [
		// { path: "", component:   },
		{ path: "/", component: Home, children: [
			{ path: "", component: HomeMain  },
			{ path: "posts", component:  HomePosts, children: [
				{ path: "page/:page", component: HomePosts },
				{ path: "search/:search", component: HomePosts, children: [
					{ path: "page/:page", component: HomePosts },
				]},
				{ path: "category/:category", component:  HomePosts, children :[
					{ path: "page/:page", component:  HomePosts }
				] },
			]},
			{ path: "post/:post", component:  HomeViewPost},
			{ path: "about", component:  HomeAbout},
			{ path: "/:pathMatch(.*)*", component: NotFound }
		]},
		{ path: "/admin", component: Admin, children: [
			{ path: "", component: AdminHome},
			{ path: "list", component: AdminList, children: [
				{path: "", component: AdminListTable},
				{path: "page/:page", component: AdminListTable},
				{path: "add", component: AdminListAdd},
				{path: "edit/:id", component: AdminListEdit},
				{path: "search/:search", component: AdminListTable, children: [
					{path: "page/:page", component: AdminListTable},
				]},
			]},
			{ path: "account", component: AdminAccount }
		]},
		{ path: "/login", component: AdminLogin },
		{ path: "/:pathMatch(.*)*", component: NotFound },
	]
});

// Router.beforeEach( (to, from) => {
// 	// console.log({to, from})

	
// })