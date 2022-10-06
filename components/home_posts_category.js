const HomePostsCategory = {
	template: `
		<div>
			<div class="card shadow-sm">
	  			<div class="card-body">
					<p class="lead fw-bold mb-1">Categories</p>
					<hr class="mt-0"/>

					<div class="d-flex flex-wrap mb-3 mx-2">
						<a v-for="x in category" :key="x.category_id"
						style="text-decoration: none; " :title="x.category_name"
						class="text-secondary own-hover me-1" href="#/" 
						@click.prevent="$emit('category', x.category_name)"> 
						{{x.category_name}},
						</a>
					</div>
				</div> 
			</div>
		</div> 
	`,
	setup () {

		let { onMounted, ref } = Vue;
		let {server} = services();
		let router = VueRouter.useRouter();

		let category = ref([])

		onMounted( () => {

			query.getAllCategory(true).then( resp => {
				server(resp).then( resp2 => {
					category.value = resp2
				})
			})

		})

		return {
			category,
		
		}
	}
}