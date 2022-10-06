const AdminLogin = {

	template: `
		<div>
			<h1>Admin Login</h1>
			<p> username <br/>
			<input :value="user.username" @change="e=>user.username = e.target.value"/> <br/>
			password <br/>
			<input type="password" :value="user.password" @change="e=>user.password = e.target.value"/> <br/>
			<button @click="login">login</button> 
			</p>
		</div>
	`,
	setup() {

		let user = Vue.ref({
			username: "",
			password: ""
		});
		let store = Vuex.useStore();
		let router = VueRouter.useRouter();



		let login = async () => {
			
			let data = {login: [user.value.username, user.value.password]}
			// console.log(data)

			await store.dispatch('admin/action', {action: 'logout',payload: null})
			services().server(data).then(resp => {
				// console.log(resp)
				if(!resp) return alert("wrong username or password");

				store
				.dispatch('admin/action', {action: 'setAdmin', payload: {...resp, logged: true}})
				.then( () => router.push("/admin"))
				

			});
		}

		Vue.watch( () => store.state.admin, (now, old) => {
			// console.log({now})
		}, {deep: true})

	

		return {
			user,
			login
		}
	}
}