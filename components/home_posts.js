let HomePosts = {

	template: `
		<div class="container">

			<div class="row justify-content-center">
				<div class="col-12 col-sm-12 col-md-11 col-lg-9" >
					<h1 class="mt-3">Blog list</h1>
					<div class="input-group mb-1" style="max-width: 450px">
					  <input type="text" class="form-control" placeholder="Blog Title..." 
					  aria-label="Blog Title..." aria-describedby="button-addon2"
					  :value="search" @change="e=>changeSearch(e.target.value)">
					  
					  <button class="btn btn-outline-secondary" type="button"
					   id="button-addon2" @click="goSearch()">Search</button>
					</div>
					<p v-if="category != ''" class="mb-1 text-muted">search category: '{{category}}'</p>
					<p v-else-if="search != ''" class="mb-1 text-muted">search: '{{search}}'</p>
					<div v-else style="height: 25px"> </div>
				</div>
				
			</div>

			<div class="row justify-content-center">
				<div class="col-12 col-sm-12 col-md-7 col-lg-6">

					
					<div v-if="load">
						<div class="d-flex justify-content-center" style="height: 50px">
							<div class="spinner-border text-success align-self-center" role="status" >
							  <span class="visually-hidden">Loading...</span>
							</div>
						</div>
					</div>
					<home_posts_list :data="posts"  v-else/>
					
					

				    <div class="d-inline-flex">
				     <p class="align-self-center mb-1">Pages: </p>
				     <ul class="pagination pagination-sm mt-3 ms-2	">
					   
					    <li :class="'page-item '+(x == pageNow && 'active')" v-for="(x, i) in pages" >
					    	<a class="page-link " href="#/"
					    	:key="i" @click.prevent="goTo(x)">{{x}}</a>

					    </li>
					   
					  </ul>

					  <ul class="pagination pagination-sm mt-3 mx-2 ">
					  	<li class="page-item ">
					  		<a :class="' page-link '+(end && 'disabled') " href="#/"
					  		@click.prevent="loadMore()">{{end ? "end" : "more..."}}</a>
					  		</li>
					  </ul>
				    </div>

				</div>
				<div class="col-12 col-sm-11 col-md-4 col-lg-3">
					<home_posts_category @category="e=>goCategory(e)"/>
				</div>
			</div>
		
		</div>	
	`,
	setup () {
		
		let { onMounted, ref, computed, watch } = Vue;
		let route = VueRouter.useRoute();
		let router = VueRouter.useRouter();
		let {server, addViews} = services();
		let store = Vuex.useStore();
		let data = ref({
				category: "",
				search: "",
				page: 1,
				pages: [1],
				posts: []
			})
		let end = ref(false);
		let load = ref(false)
		


		let resetData = (field) => {

			if(field) data.value[field] = "";
	
			data.value.page = 1;
			 data.value.pages = [1];
			 data.value.posts = [];
			end.value = false;
		}

		onMounted( () => {
			evaluateParams()
		})

		let evaluateParams = () => {
			
			if(route.params.page) {
				let page = 1;
				let pages = [];
				if(!isNaN(route.params.page)) {
					page = Math.abs(Math.floor(Number(route.params.page)))
				}
				

				for(var i = 1; i <= page; i++) {
					pages.push(i)
				}
				data.value.pages = pages
				data.value.page = page;
			}

			if(route.params.search) {
				data.value.search = route.params.search
			}

			if(route.params.category) {
				data.value.category = route.params.category
			}

			// console.log(data.value)

			getPosts();
		
		}

		let getPosts = async (type) => {
			load.value = true
			let statement = null;

			if (data.value.category != "") {
				console.log({statement: data.value.page})
				statement = await query.getPostsByCategory({
					category: data.value.category,
					page: data.value.page
				})
				
			}
			else {
				statement = await query.getPosts({
					search: data.value.search,
					page: data.value.page
				}, true);
				
			}

			// console.log(statement)

			let resp = await server(statement);


			if(resp == null) {
				// console.log("no results")
				router.go(-1)
				end.value = true;
			}
			else {

				for(var i = 0; i < resp.length; i ++) {
					let statement2 = await query.getPostCategory(resp[i].post_id, true)

					let category = await server(statement2)
					// console.log(category)
					if(category != null) resp[i].category = category;
					else resp[i].category = [];
				}
				
				data.value.posts = resp

				if(type=='more') {
					// console.log(data.value.pages)
					let newPage = data.value.pages[data.value.pages.length - 1] + 1;
					data.value.pages.push(newPage)
				}
				window.scrollTo(0, 0);
				console.log(data.value.posts)
			}
			
            load.value = false
		}

		let loadMore = async () => {
			
			
			let page = data.value.pages[data.value.pages.length - 1] + 1;
			data.value.page = page;
			// console.log(page)
			if(data.value.search != "") {
				// console.log("has search")
				router.push(`/posts/search/${route.params.search}/page/${page}`)
			}
			else if (data.value.category != "") {
				// console.log("has category")
				router.push(`/posts/category/${route.params.category}/page/${page}`)
			}
			else {
				// console.log("default")
				router.push(`/posts/page/${page}`)
			}

			getPosts('more')

			
		}

		let goTo = async (x) => {
			console.log({goto: x})
	
			data.value.page = x
			if(data.value.search != "") {
				router.push("/posts/search/"+data.value.search+"/page/"+x);
			}
			else if (data.value.category != "") {
				router.push("/posts/category/"+data.value.category+"/page/"+x);
			}
			else router.push("/posts/page/"+x);
			
			getPosts('to')

	
		}

		let goCategory = (x) => {
			// console.log(x)
			
			resetData('search')
			data.value.category = x;
			router.push("/posts/category/"+x);

			getPosts();
		}

		let goSearch = () => {
			
			resetData('category')
			
			if(data.value.search != ""){
				router.push("/posts/search/"+data.value.search);
			} 
			else {
				router.push("/posts");
			}

			getPosts();
		}


		watch( () => data.value, (now, old) => {
			// console.log(now? now : false);
			
		}, {deep: true})
	
		return {
			posts: computed(() =>  data.value.posts),
			time: (date) => moment(date).format('MMM D, YYYY '),
	
			getPosts,
			search: computed( () => data.value.search),
			category: computed( () => data.value.category),
			changeSearch: x => data.value.search = x,
			pages: computed( () => data.value.pages),
			loadMore,
			goTo,
			pageNow: computed( () => data.value.page),
			end,
			router,
			goSearch,
			goCategory,
			load
		}
	}
}