let HomeMisc = {
	template:`
		<div >
		<h1>Interests</h1>
			<div class="input-group mb-3 mt-3" style="max-width: 350px">
			  <input type="text" class="form-control" placeholder="search post title..." 
			  aria-label="Recipient's username" aria-describedby="button-addon2"
			  :value="search" @change="e=>search = e.target.value">
			  <button class="btn btn-outline-success bg-gradient" type="button" 
			  id="button-addon2" @click="searchPosts()">Find</button>
			</div>
			<div class="row">
				
				<div class="col-12 col-sm-6 col-md-12 mb-3">
					<div class="card shadow-sm">
  						<div class="card-body">
							<h3 >Popular</h3>
							<hr class="mt-0">
							<div v-for="x in posts" :key="x.post_id" class="mb-4 ms-2">
								<h6 class="mb-0 text-capitalize fw-bold" style="cursor: pointer;"
								@click="goTo(x.post_hash_id)">{{x.post_title}}</h6>
								<p class="text-capitalize mb-0">By 
									<span class="text-capitalize fw-bold text-muted">{{x.admin_username}}</span><br/> 
									views: <span class="fw-bold text-muted">{{x.post_view}} </span> | 
									date: <span class="fw-bold text-muted">{{time(x.post_date)}}</span>
								</p> 
								<a href="#/" @click.prevent="goTo(x.post_hash_id)">Read post</a>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-sm-6 col-md-12 mb-3"> 
					<div class="card shadow-sm">
						<div class="card-body">

						
							<h3>Categories</h3>
							<hr class="mt-0">
							<div class="d-flex flex-wrap">
								<p v-for="(x, i) in category" :title="x.category_name"
								@click="router.push('/posts/category/'+x.category_name)" 
								style="cursor: pointer" class="me-1  ms-2 my-0 own-hover" >
									<span v-if="i < 9">{{x.category_name}},</span>
								</p>
							</div>

							<a href class="me-2 ms-2" @click.prevent="router.push('/posts')"> more...</a>
						</div>
					</div>	
				</div>
			</div>

			
			<div>
				
			</div>
			
		</div>
	`,
	setup() {

		let { server, addViews } = services();
		let { onMounted, ref } = Vue;
		let router = VueRouter.useRouter();
		let store = Vuex.useStore();

		let category = ref([])
		let posts = ref([])
		let search = ref("")

		onMounted( () => {
			loadPost();
			loadCategory();
		})

		let loadPost = () => {
			query.getPopularPosts().then( resp => {
				server(resp).then(resp2 => {
					// console.log({popular: resp2})
					posts.value = resp2;
				})
			})
		}

		let loadCategory = () => {
			query.getAllCategory(true).then(resp => {
				server(resp).then( resp2 => {
					category.value = resp2
					// console.log(resp2)
				})
			})
		}

		let searchPosts = () => {
			console.log(search.value)
			if(search.value != "") router.push("/posts/search/"+search.value);
			else router.push("/posts");
		}

		let goTo = (x) => {
			// console.log(x)
			router.push("/post/"+x);
			store.dispatch("viewer/action", {action: "setLoad", payload: true})
			store.dispatch("viewer/action", {action: "setHashId", payload: x})

			addViews(x)
			loadPost();

		}


		return {
			goTo,
			posts,
			time: (date) => moment(date).format('MMM D, YYYY '),
			category,
			router,
			searchPosts,
			search
		}
	}
}