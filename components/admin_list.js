const  AdminList = {
	template: `
		<div>
			
			<ul class="nav nav-tabs" id="myTab" role="tablist">
			  <li class="nav-item" role="presentation">
			    <button @click.prevent="router.push('/admin/list/')"
			    :class="'nav-link '+(tab? '':'active')" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">
			    Posts
			    </button>
			  </li>
			  <li class="nav-item" role="presentation">
			    <button @click.prevent="router.push('/admin/list/category')"
			    :class="'nav-link '+(tab? 'active':'')" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">
			    Categories
			    </button>
			  </li>
			 
			  
			</ul>
			
			<router-view />
			
		</div>
	`,
	setup () {

		let { server, } = services();
		let {onMounted, ref, computed, watch} = Vue;
		let store = Vuex.useStore();
		let router = VueRouter.useRouter();
		let { params, path } = VueRouter.useRoute();
		let tab = ref(false)
		

		onMounted( () => {
			// console.log(params.page, !isNaN(Number(params.page)))
			console.log(router)

			if(path.includes("category")) {
				tab.value = true
			}

			if("page" in params) {
				if(!isNaN(Number(params.page))){

					let page = Math.floor(Number(params.page));
					let pages = []
					store.dispatch("post/action", {action: "setPage", payload: page})
					for(let i = 1; i <= page; i++) {
						pages.push(i)
					}
					// console.log(pages)
					store.dispatch("post/action", {action: "setPages", payload: pages})
				} 
				else window.history.pushState({}, '', "#/admin/list")
			}

			else if ("search" in params ) {
				
				store.dispatch("post/action", {action: "setSearch", payload: params.search})
			
			}

			getPosts();

		})

		let getPosts = () => {
			let data = {
				page: store.state.post.page,
				search: store.state.post.search
			}
			query.getPosts(data).then( resp => {
				// console.log(resp)
				// return
				server(resp).then( async resp2 => {
					// console.log(resp2 == null)
					if(resp2 == null) {
						router.replace("/admin/list");
						await store.dispatch("post/action", {action: "setPages", payload: [1]})
						await store.dispatch("post/action", {action: "setPage", payload: 1})
						getPosts();
						return;
					}

					store.dispatch("post/action", {action: "setPosts", payload: resp2}).then( () => {
						// console.log(store.state.post.posts)
					})
				})
			})
		}



		watch( () => params, (now, old) => {
			// console.log(now, old)
		}, {deep: true})

		return {
			router,
			tab
		}	
	}
}