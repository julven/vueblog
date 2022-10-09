let AdminListAddCategory = {
	template: `
		<div class="mb-2">

			<div class="dropdown">
			  <button class="btn btn-sm btn-success dropdown-toggle" 
			  type="button" data-bs-toggle="dropdown" aria-expanded="false">
			    Add Category
			  </button>
			  <ul class="dropdown-menu">
			    
			  	<li class="px-2">
			    	<input v-model="search" 
			    	placeholder="search..."
			    	class="form-control form-control-sm"/>
			    </li>
			    <li @click.prevent="">
			    	<a class="dropdown-item" href="#/"
			    	v-for="x in category" :key="x.category_id"
			    	v-if="exists" @click="addCategory(x, $emit)">
			    	{{x.category_name}}
			    	</a>
			    	<span v-else>not found </span>
			    </li>

			  </ul>
			</div>


		</div>
	`,
	props: ['categories'],
	setup ({categories}) {

		let { ref, watch, onMounted } = Vue;
		let {server} = services();
		let timeout = null
		let category = ref([])
		let refCategory = ref(categories)
		let exists = ref(true)
		let search = ref("")

		onMounted( () => {
			// console.log({addaCategory:categories})
			// return	
		})

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
				else {



					category.value = resp
				} 

				// console.log(resp, categories)

			}, 1000)
		}

		let addCategory = async (x) => {


			// console.log(categories.length > 2);
			// return;

			if(categories.length  > 2) {
				alert("maximum of 3 categories per post!")
				return;
			}
			else if(categories.length > 0) {
				let exists = false;
				categories.forEach( (xx, ii) => {
					console.log({compare: xx.category_id == x.category_id})

					if(xx.category_id == x.category_id) {
						alert("category exists")
						exists = true
						return;
					}
				})

				if(!exists) categories.push(x)
			}

			else {
				categories.push(x)
			}

			// console.log(categories)
			
			// search.value = "";
			// category.value = [];


			//  emit('emitAddCategory', categories);
			
			
		}

		watch(() => search.value, (now, old) => {
			searching(now)
		},{deep: true}) 

		watch(() => categories, (now, old) => {
			console.log({propsCategory: now})
		},{deep: true}) 

		return {
			search,
			category,
			exists,
			addCategory

		}
	}
}