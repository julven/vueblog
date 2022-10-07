let HomePost = {

	template: `
		<div class=" mb-3" v-if="!loading">
			<h1 class="text-capitalize mb-0">{{post.post_title}}</h1>
			
			<p class="text-capitalize mb-4">By {{post.admin}} on {{time(post.post_date)}}</p>

			<div v-for="x in contents">	
				<div v-if="x.paragraph_id">
					<p class="" style="text-align: justify">{{x.paragraph_content}}</p>
				</div>

				<div v-if="x.image_id" style="max-width: 350px" class="mb-2">
					<img :src="x.image_path" style="width: 100%" class=" shadow-sm"/><br>
					<small class="text-secondary">{{x.image_caption}}</small>
				</div>

				<div v-if="x.header_id">
					<h4 class="text-capitalize">{{x.header_content}}</h4>
				</div>
			</div>
			<hr class="mb-3"/>
			<p class="my-0">Views: {{post.post_view}}</p>
			<p class="mb-0">Category: </p>
			<span class="badge rounded-pill bg-success me-2 mb-2" v-for="xx in post.category">
				{{xx.category_name}}
			</span><br/>
			
			

			<a href="#/" @click.prevent="router.go(-1)">Go back </a>
		</div>
	`,
	setup () {

		let { onMounted, ref, computed, watch } = Vue;
		let route = VueRouter.useRoute();
		let router = VueRouter.useRouter();
		let {server} = services();
		let store = Vuex.useStore();
		let post = ref({})
		let contents = ref([])
		let postHashId = ref("")

		onMounted( () => {
			
			if("post" in route.params) {
				// console.log(route.params)
				// return;
				let hashId = route.params.post;
				postHashId.value = hashId;
				loadPost(hashId)
				
			}
			else {
				store.dispatch("viewer/action", {action: "setLoad", payload: false});
				router.push("/")
			} 
		}) 
		let loadPost = async (hashId) => {
			query.getPost2(hashId, true).then(resp => {
				// console.log(JSON.stringify(resp))
				server(resp).then( async resp2 => {
					// console.log(resp2)
					if(resp2 == null){
						router.push("/")
						store.dispatch("viewer/action", {action: "setLoad", payload: false})
					} 
					else if( resp2[0].post_status == 'archive') {
						alert("this post has been archived and not available")
						router.back()
					}
					else {

						post.value = resp2[0];
						loadContent(resp2, hashId);
					}
					
				})
			})
			
		}

		let loadContent = async (resp2, hashId) => {
			
			let p = await query.getContent(hashId, 'paragraph', true)
			let img = await query.getContent(hashId, 'image', true)
			let h = await query.getContent(hashId, 'header', true)
			let cat = await query.getPostCategory(post.value.post_id, true);

			// console.log(cat);

			let [a, b, c, d] = await Promise.all([
				server(p),
				server(img),
				server(h),
				server(cat)
			])
			let data = [];
			if(a != null) data = [...data, ...a];
			if(b != null) data = [...data, ...b];
			if(c != null) data = [...data, ...c];

			// console.log({d});
			// return;

			data.forEach( (x, i) => {
				if(Object.keys(x).includes("paragraph_index")) {
					x.index = x.paragraph_index;
				}
				else if (Object.keys(x).includes("image_index")) {
					x.index = x.image_index;
				}
				else x.index = x.header_index;
			})

			data.sort( (a,b) => a.index - b.index);

			if(d != null) post.value.category = d;
			else  post.value.category = [];
			contents.value = data;
			store.dispatch("viewer/action", {action: "setLoad", payload: false})
		}

		watch( () => store.state.viewer, (now) => {
			// console.log(post.value, now.hashId)
			// loadContent(post.value, now.hashId)
			loadPost(now.hashId)
		}, { deep: true})

		return {
			post,
			contents,
			time: (date) => moment(date).format('MMM D, YYYY '),
			router,
			loading:  computed(() => store.state.viewer.loading)

			
		}
	}
}