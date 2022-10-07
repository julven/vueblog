const AdminListCategory = {
	template: `
		<h4>Categories | <router-link to="/admin/list">Posts</router-link></h4>
		<input v-model="search"/><button @click="getCategory()">find</button>

		<ul  >
			<li v-if="load">loading...</li>
			<li v-for="x in list"  v-else-if="!load && list.length > 0">
				{{x.category_name}} ({{x.count}})
				<a href="#/" @click.prevent="" :title="x.count+' post(s)'">?</a> |
				 <a href="#/" @click.prevent="deleteCategory(x)">x</a>
			</li>
			<li v-else>
				no results. 
				<a href="#/" @click.prevent="addCategory()">add "{{add}}?"</a>
			</li>

		</ul>
		
	`,
	setup () {

		let { onMounted, ref, watch } = Vue
		let { server } = services();

		let list = ref([])
		let search = ref("")
		let load = ref(false)
		let add = ref("")
		onMounted( () => {

			getCategory();

		})

		let getCategory = async () => {
			load.value = true
			// console.log(search.value)

			let statement = await query.readCategory(search.value)
			let resp = await server(statement)

			if(resp == null){
				list.value = [];
				add.value = search.value
			} 
			else {

				let arrCount = [];

				for(var i = 0; i < resp.length; i ++) {

					let statement2 = await query.getCategoryByCategoryPost(resp[i].category_id)
					arrCount.push(() => server(statement2))

					// let count = await server(statement2)
					// if(count == null) resp[i].count = 0;
					// else  resp[i].count = count[0].count

				}

				let allCount = await Promise.all(arrCount.map( func => func()))

				allCount.forEach( (x, i) => {
					if(x[0].count > 0) resp[i].count = x[0].count;
					else resp[i].count = 0;
				})

				// console.log(allCount)
				list.value = resp

			}
			load.value = false
			
		}

		let addCategory = async () => {

			// console.log(add.value)
			let statement = await query.addCategory(add.value)

			let resp = await server(statement)

			// console.log(resp)

			search.value = add.value
			getCategory()
		}

		 let deleteCategory = async (x) => {
		 	let conf = window.confirm("delete this category: "+x.category_name+"?")
		 	if(conf) {
		 		// console.log(x)
		 		let statement = await query.deleteCategory(x.category_id)
		 		let statement2 = await query.deletePostCategorySimple(x.category_id)

		 		Promise.all([
		 			server(statement),
		 			server(statement2)
		 			]).then( resp => {
		 				// console.log(resp)
		 				// 
		 				search.value = "";
						add.value = "";
						getCategory();
		 				
		 			})
		 	}
		 }

		watch( () => search.value, (now, old) => {
			
			if(now == "") {
				// console.log(now)
				getCategory();
			}
		})

		return {
			list,
			search,
			getCategory,
			load,
			add,
			addCategory,
			deleteCategory


		}
	}
}