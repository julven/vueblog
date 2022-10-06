let AdminListEditCategory = {
	template: `
		<div class="">

		  <a class="" href="#" role="button" id="dropdownMenuLink" 
		  data-bs-toggle="dropdown" aria-expanded="false">
		    Add Category
		  </a>

		  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
		    <li>
		    	<input v-model="search"/>
		    	
		    </li>
		    <li @click.prevent="">
		    	<a class="dropdown-item" href="#/"
		    	v-for="x in category" :key="x.category_id"
		    	v-if="exists" @click="addCategoryToPost(x, $emit)">
		    	{{x.category_name}}
		    	</a>
		    	<span v-else>not found </span>
		    </li>
		    
		  </ul>
		</div>
	`,
	props: ['post_id', 'categories'],
	setup ({post_id, categories}) {

		let { ref, watch } = Vue;
		let {server} = services();
		let timeout = null
		let category = ref([])
		let exists = ref(true)


		let search = ref("")

		let searching = (x) => {
			exists.value = true
			window.clearTimeout(timeout)
			timeout = setTimeout( async() => {
				if(x == "") {
					category.value = []

					return;
				} 
				let statement = await query.getCategory(x);
				// console.log(statement)
				// return;
				let resp = await server(statement);

				if(resp == null) exists.value = false;
				else category.value = resp

				console.log(resp)
			}, 1000)
		}

		let addCategoryToPost = async (x, emit) => {


			// console.log(categories.length > 2);
			// return;

			if(categories.length  > 2) {
				alert("maximum of 3 categories per post!")
				return;
			};

			let new_category = null;
			let post_category = null;
			if(x) {
				 post_category = await query.addPostCategory({
				 	post_id: post_id,
				 	category_id: x.category_id
				 });

				 let resp  = await server(post_category);
				
				
				search.value = "";
				category.value = [];


				 emit('reloadPost');
				
				 


			}
			
			
		}

		watch(() => search.value, (now, old) => {
			searching(now)
		},{deep: true}) 

		return {
			search,
			category,
			exists,
			addCategoryToPost

		}
	}
}