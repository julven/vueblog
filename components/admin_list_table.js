const  AdminListTable = {
	template: `
		<div>
			<h4> Posts | <router-link to="/admin/list/category">Categories</router-link></h4>
			<input v-model="localSearch"/> 
			<button @click="goSearch()">Search</button> |
			<router-link to="/admin/list/add">add</router-link> |
			
			<table>
				<thead>
					 <tr>	
					 	<th>ID</th>
					 	<th>title</th>
					 	<th>date</th>
					 	<th>admin</th>
					 	<th>status</th>
					 	<th>action</th>
					 </tr>
				</thead>
				<tbody>
					<tr v-for="x in posts" :key="x.post_id">
						<td>{{x.post_id}}</td>
						<td>{{x.post_title}}</td>
						<td>{{time(x.post_date)}}</td>
						<td>{{x.admin}}</td>
						<td>{{x.post_status}}</td>
						<td>
							<router-link :to="'/admin/list/edit/'+x.post_hash_id">edit</router-link> |
							<router-link :to="'/post/'+x.post_hash_id" v-if="x.post_status == 'active'">view</router-link>
						</td>
					</tr>
				</tbody>
			</table>

			<p> 
				page(s) 
				<span v-for="(x, i) in pages" >
				
					<router-link v-if="x != page"
					:to="'/admin/list/page/'+x" 
					@click="(e)=>goToPage(e,x)">{{x}}</router-link> 
					<span v-else>{{x}}</span>|
					
				</span>
				<span  v-if="end">end</span >
				<a href="#/" @click="e => clickMore(e)" v-else> more...</a>
			</p>
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