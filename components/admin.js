const  Admin = {
	template: `
		<nav class="navbar fixed-top navbar-expand-sm bg-success shadow-sm">
		  <div class="container " @click.prevent="">
		    <a class="navbar-brand  text-white" href="#">Admin</a>
		    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
		      <span class="text-white fs-1">&#9776;</span>
		    </button>
		    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
		      <div class="navbar-nav  text-white text-center">

		      	<router-link to="/admin"  class="nav-link active  text-white"> Home </router-link>
		      	<router-link to="/admin/list" class="nav-link  text-white"> List </router-link>
		      	<router-link to="/admin/account" class="nav-link  text-white"> Account </router-link>

		     
		       
		      </div>
		      <div class="navbar-nav ms-auto  text-center">

		      	<a href="#/" class="nav-link  text-white" @click="logout">Logout</a>

		      </div>
		    </div>
		  </div>
		</nav>
		<div style="height: 65px"/>
		<div class="container">
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