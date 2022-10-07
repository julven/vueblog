const App = {

	template: `
		<div>
			<router-view/>
			
		</div>
	`,
	setup() {
		let { server, authenticate } = services();
		let { watch, computed, onMounted,  onBeforeUnmount} = Vue;
		let router = VueRouter.useRouter();
		let store = Vuex.useStore();
		let {state: {admin}} = Vuex.useStore();
		let logged = computed(() => admin.logged);
		let initRoute = {init: "/", changed: false};

		watch( admin, (now, old) => {

			// console.log({logged: now.logged})
			// if(now.logged) router.push("/admin");
			// else router.push("/")
		}, {deep: true})

		onMounted( () => {
			authentication();
		})
		
		let authentication = () => {
			// console.log(moment().format('YYYY-DD-MM H:mm:ss'))
			try {
				let auth = JSON.parse(window.localStorage.auth)
				store.dispatch("admin/action", {
					action: "setAdmin", 
					payload: {
						admin_id: auth.id, 
						admin_token: auth.token
					}
					
				}).then( () => {
					server({auth: ""}).then( resp => {			
						// console.log({auth: resp})
						if(!resp) {
							// console.log("failed to authenticate")
							return;
						}
						store.dispatch("admin/action", {
							action: "setAdmin",
							payload: {...resp, logged: true}
						}).then( () => {
							if(initRoute.init == "/login") router.push("/admin");
							else router.push(initRoute.init)
						})
					})
				})

			}
			catch (err) {
				console.log({fromAuth: err})
			} finally {
				window.localStorage.removeItem("auth")
			}
		}

		window.onbeforeunload = () => {
			if(admin.logged) {
				window.localStorage.auth = JSON.stringify({
					token: admin.admin_token, 
					id: admin.admin_id 
				})
			}
		}


		router.beforeEach( async ( to, from ) => {
			// console.log(to.path, from.path)
		
			if(!initRoute.changed) initRoute = {init: to.path, changed: true}		
					
			if(to.path.includes("/admin")) {

				if(admin.logged) return true;
				else {
					router.push("/login")
				}
				
			}
			else if (to.path == "/login") {

				if(admin.logged && initRoute != "/login") {
					router.push(initRoute)
				}
			}
			else return true;
			
		})

	
		return {
		
		}
	}
}