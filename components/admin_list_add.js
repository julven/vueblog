
const  AdminListAdd = {

	template: `
		
		<div class="row">
			<div class="col-12 col-sm-6">
				<h3 class="mt-2">Create Post</h3>
				<div class="mb-1">
				  <label  class="form-labe mb-0">Title</label>
				  <input :value="firstContent[0].value" @change="e=> firstContent[0].value = e.target.value"
				  type="text" class="form-control"  placeholder="post title...">
				</div>

				<p class="my-1">
					Category: 
					<span v-for="x in categories" 
					class=" fw-bold text-white badge text-bg-success me-1 rounded-pill">
						{{x.category_name}}  
						<a  class="text-danger"
						href="#/" @click.prevent="removeCategory(x)" 
						title="delete category"> x
						</a>
					</span>
				</p>
				<admin_list_add_category :categories="categories" />


				<div class="mb-1">
				  <label  class="form-label mb-0">Image File</label>
				  <input  accept="image/png, image/gif, image/jpeg" 
				  @change="e => firstContent[1].value = e.target.files[0]" 
				  class="form-control" type="file" ref="image">
				</div>

				<div class="mb-1">
				  <label class="form-labe mb-0">Image Caption</label>
				  <input :value="firstContent[1].cap" 
				  @change="e=> firstContent[1].cap = e.target.value"
				  type="text" class="form-control"  placeholder="image caption...">
				</div>

				<div class="mb-1">
				  <label  class="form-label  mb-0" >Paragraph</label>
				  <textarea :value="firstContent[2].value" 
				  @change="e=> firstContent[2].value = e.target.value"
				  class="form-control" rows="3" placeholder="paragraph..."></textarea>
				</div>
			</div>

			<div class="col-12 col-sm-6">
				<h3 class="mt-2">Post Content</h3>
				<div v-for=" (x, i) in content" :key="x.id">
					<paragraph_comp v-if="x.type==='p'" 
					:data="x" 
					@deleting=" e=> deleteContent(e)" 
					@index="e => changeIndex(e) "/>
					<image_comp v-if="x.type==='img'" 
					:data="x" 
					@deleting=" e=> deleteContent(e)" 
					@index="e => changeIndex(e) "/>
					<header_comp v-if="x.type==='h3'" 
					:data="x" 
					@deleting=" e=> deleteContent(e)" 
					@index="e => changeIndex(e) "/>
				</div>

			<div class="input-group">
 				<span class="input-group-text">Add Field</span>
			  <select class="form-select" ref="choose"
			  aria-label="Example select with button addon">
			
			  	<option value="p">paragraph</option>
				<option value="img">image</option>
				<option value="h3">header</option>
			  </select>
			  <button class="btn btn-outline-success" 
			  @click="setContent" type="button">Add</button>
			</div>


			</div>

			<div class="col-12">
				<div class="d-grid gap-2 mt-3 d-md-flex justify-content-md-end">
				  <button 
				  @click="router.push('/admin/list')"
				  class="btn btn-outline-secondary me-md-2" type="button">Back</button>
				  <button 
				  @click="addContent()"
				  class="btn btn-success" type="button">Submit</button>
				</div>
			</div>	
		</div>
	`,
	setup () {
		let { server, validation } = services();
		let randId = () => Math.random().toString(36).slice(2, 7);
		let { ref, watch, computed } = Vue;
		let router = VueRouter.useRouter();
		let {state } = Vuex.useStore();
		let firstContent = ref([
			{type: "h1", value: "", id: randId()},
			{type: "img", value: null, cap: "", id: randId() },
			{type: "p", value: "", id: randId()},
			])
		let choose = ref(null)
		let content = ref([])
		let categories = ref([])
		let image = ref(null)

		

		let setContent = () => {
			// console.log(choose.value.value)
			if(choose.value.value === "p"){
				content.value.push({type: "p", value: "", id: randId()});
			} 

			else if (choose.value.value === "img"){
				content.value.push({type: "img", value: null, cap: "", id: randId()});
			} 

			else content.value.push({type: "h3", value: "h3", value: "", id: randId()});

			// console.log(content.value)
		}

		let changeIndex = ({id, direction}) => {

			let index = content.value.findIndex( object => {
				return object.id === id;
			})
			// console.log(index, content.value.length - 1 > index, 0 < index)

			if(direction === "up" && 0 < index) {
				[content.value[index - 1], content.value[index]] =
				[content.value[index], content.value[index - 1]]
				return;
			}
			if(direction === "down" && content.value.length - 1 > index){

				[content.value[index + 1], content.value[index]] =
				[content.value[index], content.value[index + 1]]
				return;
			}
		}

		let deleteContent = id => {
			// console.log(id)
			// return;
			let newContent = []
			content.value.forEach( x => {
				if(x.id !== id) newContent.push(x)
			})

			content.value = newContent;
		}

		let removeCategory = (x) => {

			let newCategory = [];
			categories.value.forEach( xx => {
				if(x.category_id != xx.category_id) newCategory.push(xx) 
			})

			categories.value = newCategory
			console.log(categories.value)
		}

		let addContent = async () => {

			// console.log(categories.value.length)
			// return

			let valid = [
				validation(firstContent.value),
				validation(content.value),
				categories.value.length > 0
			]

			

			if(valid.includes(false)) {
				alert("all fields must not be empty!")
				return
			}

			// console.log(valid.includes(false))
			// return

			let arrContent = [firstContent.value[1], firstContent.value[2], ...content.value];
			let statements = [];

			let post = await query.writePost2({
				post_title: firstContent.value[0].value,
				admin_id: state.admin.admin_id,
			})

			let post_hash = post.write2.post[2][1]

			for( var i = 0; i < arrContent.length; i++){
				let statement = null
				if(arrContent[i].type == "img"){
					// console.log(arrContent[i].cap);
					statement = await query.writeImage({
						file: arrContent[i].value, 
						caption: arrContent[i].cap, 
						hashId: post_hash,
						index: i
					});
				} 
				else {
					// console.log(arrContent[i])
					statement = await query.writeContent({
						content: arrContent[i].value, 
						index: i, 
						hashId: post_hash,
					}, arrContent[i].type);
				} 

				statements.push(statement)
				
				
			}

			let servers = [];
			servers.push(() => server(post))
			statements.forEach( x => {
				servers.push(() => server(x))
			})

			// console.log(servers)
			// return;

			Promise.all(servers.map( func => func())).then(resp => {

				categories.value.forEach( x => {

					query.addPostCategory({
						category_id: x.category_id,
						post_id: resp[0].insert_id
					}).then( resp2 => {
						server(resp2).then(resp3 => {
							console.log({category: resp3})
						})
					})
				})

				alert("post submitted")
				categories.value = [];
				content.value = [];
				firstContent.value = [
					{type: "h1", value: "", id: randId()},
					{type: "img", value: null, cap: "", id: randId() },
					{type: "p", value: "", id: randId()}
				];

				// query.getPosts({search: "", page: 1}).then( resp => {
				// 	store.dispatch("post/action", { action: "setPosts", payload: resp})
				// })


			})

		}

		watch(() => content.value, (now, old) => {
			// console.log(now)
		}, {deep: true})

		watch(() => image.value, (now, old) => {
			// console.log(now.files[0] )
		}, {deep: true})
	


		return {
			choose,
			content,
			setContent,
			deleteContent,
			addContent,
			router,
			changeIndex,
			firstContent,
			categories,
			removeCategory,
			image
		}
	},
	beforeRouteLeave( to, from) {
		const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  		if (!answer) return false
	}
}