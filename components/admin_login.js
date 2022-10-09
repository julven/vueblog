const AdminLogin = {

	template: `
		<div class="container">
			<div class="row justify-content-center mt-5">
				<div class="col-auto col-sm-7 col-md-6 col-lg-5 ">
					<div class="card shadow-sm" style="max-width: 350px">
					  <div class="card-body">
					    <h5 class="card-title">Admin Login</h5>
					    <div class="mb-1">
						    <label  class="form-label mb-0">Username</label>
						    <input :value="user.username" @change="e=>user.username = e.target.value"
						    type="text" class="form-control"  aria-describedby="emailHelp">
						
						  </div>

  					    <div class="mb-3 ">
						    <label class="form-label mb-0">Password</label>
						    <input :value="user.password" @change="e=>user.password = e.target.value"
						    type="Password" class="form-control" aria-describedby="emailHelp">
						  
						  </div>
						  <div class="text-end">
						  	<button 
						  	@click="login"
						  	type="button" class="btn btn-success">Login</button>
						  </div>
						  
					  </div>
					</div>
				</div>
			</div>

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