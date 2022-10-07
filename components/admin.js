const  Admin = {
	template: `
		<div>
			<h1>Admin </h1>
			<div>
				<p> 
				<router-link to="/admin"> Home </router-link> |
				<router-link to="/admin/list"> List </router-link> |
				<router-link to="/admin/account"> Account </router-link> |
				<a href="#/" @click="logout">Logout</a>
				</p>

			</div>
			<router-view />
		</div>
	`,
	setup () {

		let {server} = services();
		let store = Vuex.useStore();
		let router = VueRouter.useRouter();

		Vue.onMounted( () => {

		})
		

		let logout = () => {

			store.dispatch("admin/action", {action: "logout", payload: null}).then(()=>{
				console.log(store.state.admin)
			})
			
		}

		return {
			logout
		}
	}
			// console.log(category.
}