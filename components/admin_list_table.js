const  AdminListTable = {
	template: `
		<div class="row">
			<div class="col-12">
				<div class="d-flex my-3">
					<div class="input-group " style="max-width: 350px">
					  <input v-model="localSearch"
					  type="text" class="form-control" placeholder="Post title..." aria-label="Recipient's username" aria-describedby="button-addon2">
					  <button  @click="goSearch()"
					  class="btn btn-outline-success" type="button" id="button-addon2">Find</button>
					</div> 
					<router-link to="/admin/list/add" class="btn btn-success ms-1">New</router-link>
				</div>			
			</div>

			<div class="col-12">

				<div class="card shadow-sm mb-2" v-for="x in posts" :key="x.post_id">
				  <div class="card-body">
				   	<div class="row">
				   		<div class="col-12 col-sm-6 col-md-6 align-self-center">
				   			<small class="text-muted">admin: <b> {{x.admin}}</b> | 
				   			date: <b>{{time(x.post_date)}}</b></small>
				   			<p class="mb-0 fw-bold text-truncate" :title="x.post_title">{{x.post_title}}</p>
				   		</div>
				   		<div class="col-12 col-sm-6 col-md-3 align-self-center">
				   			<small class="text-muted">ID: <b>{{x.post_hash_id}} </b><br/>
				   			Status: <b :class="x.post_status == 'active' ? 'text-success':'text-danger' ">{{x.post_status}}</b></small>
						</div>
						<div class="col-12 col-sm-12 col-md-3 align-self-center text-end">
							<div>
								<router-link :to="'/admin/list/edit/'+x.post_hash_id">edit</router-link> |
								<span v-if="x.post_status == 'active'">
									<router-link :to="'/post/'+x.post_hash_id"  >view</router-link>
								</span>
								<span v-else class="text-muted" title="not viewable when archived">
									view
								</span>
								
							</div>
						</div>

				   	</div>
				  </div>
				</div>

			</div>

			<div class="col-12">
				<div class="d-inline-flex">
				     <p class="align-self-center mb-1">Pages: </p>
				     <ul class="pagination pagination-sm mt-3 ms-2	">
					   
					    <li class="page-item" v-for="(x, i) in pages" >
					    	<a class="page-link " href="#/"
					    	:key="i" @click.prevent="(e)=>goToPage(e,x)">{{x}}</a>

					    </li>
					   
					  </ul>

					  <ul class="pagination pagination-sm mt-3 mx-2 ">
					  	<li class="page-item ">
					  		<a class=" page-link " href="#/"
					  		@click="e=>clickMore(e)">more...</a>
					  		</li>
					  </ul>
				    </div>
			</div>
		</div>
	`,
	setup () {

		let {server}  = services();
	  	let router = VueRouter.useRouter();
		let store = Vuex.useStore();
		let {onMounted, ref, computed, watch} = Vue;
		let end = ref(false);
		let localSearch = ref("")

		let loadPosts = (type) => {
			let { search, page } = store.state.post;

			query.getPosts({search, page}).then( resp => {
				// console.log(resp)
				server(resp).then( async resp2 => {

					// console.log(resp2==null)
					if(resp2 != null){

						if(search != "") {
							// console.log(search)
							
							router.push("/admin/list/search/"+search+"/page/"+page)
						}
						else router.push("/admin/list/page/"+page);

						store.dispatch("post/action", { action: "setPosts", payload: resp2}).then(() => {
							if(type=="more"){
								let lastPage = store.state.post.pages[store.state.post.pages.length - 1];
								console.log(lastPage)
								store.dispatch("post/action", {action: "addPages", payload: lastPage+1}).then(() => {
									lastPage = store.state.post.pages[store.state.post.pages.length - 1];
									store.dispatch("post/action", {action: "setPage", payload: lastPage})
								})
								
							}
							
						})
						
					} 
					else end.value = true;
				})
			})

			
		}

		let clickMore = (e) => {
			e.preventDefault();
			
			if(end.value) return

			store.dispatch("post/action", {action: "setPage", payload: null})
			loadPosts("more")
			
		}

		let goToPage = (e, page) => {
			e.preventDefault();

			store.dispatch("post/action", {action: "setPage", payload: page});
			loadPosts("goto");
		}

		

		let goSearch = () => {
			store.dispatch("post/action", { action: "setSearch", payload: localSearch}).then( async () =>{
				await store.dispatch("post/action", {action: "setPages", payload: [1]})
				await store.dispatch("post/action", {action: "setPage", payload: 1})
				await store.dispatch("post/action", {action: "setPosts", payload: []})
				end.value = false
				loadPosts()
				// console.log(store.state.post.search)

			})
		}

		

		watch( () => store.state.post.posts, (now, old) => {
			// console.log(now.length)
			if(now.length < 10) end.value = true;
		}, { deep: true})

		return {
			end,
			posts: computed( () => store.state.post.posts),
			pages: computed( () => store.state.post.pages),
			page: computed( () => store.state.post.page),
			search: computed( () => store.state.post.search),
			time: (value) => moment(value).format('MMM D, YYYY h:mm a '),
			clickMore,
			goToPage,
			localSearch,
			goSearch,
		
		}
	}
}