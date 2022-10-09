let AdminListEditAdd = {
	
	template: `
		<div class="mt-5">

			<div v-if="select=='p'">

				<textarea @change="e=>field = e.target.value"
			  	class="form-control  mt-3" rows="3" placeholder="Add paragraph..."></textarea>


			</div>


			<div v-if="select=='img'">
		
				<input  accept="image/png, image/gif, image/jpeg" 
			 	 @change="e=>field['file'] = e.target.files[0]"
			  	class="form-control mt-3 mb-1" type="file" >

			  	<div class="mb-1">
				  <input @change="e=>field['caption'] = e.target.value"
				  type="text" class="form-control"  placeholder="add image caption...">
				</div>

			</div>




			<div v-if="select=='h3'">

				<input @change="e=>field = e.target.value"
			 	 type="text" class="form-control"  placeholder="add header...">



			</div>


			<div class="input-group mt-3">
 				<span class="input-group-text">New</span>
			  <select class="form-select"  @change="e=>selecting(e.target.value)"
			  aria-label="Example select with button addon">
			
			  	<option value="p">paragraph</option>
				<option value="img">image</option>
				<option value="h3">header</option>
			  </select>
			  
			  <button class="btn btn-outline-success" 
			  @click="addContent(props.post.post_hash_id, props.content_length, $emit)">Add</button>
			</div>



			
			
			

		</div>
	`,
	props: ['post', "content_length"],
	setup(props) {

		let {ref, watch, defineProps, onMounted} = Vue
		let { server } = services();
		
		let select = ref("p")
		let field = ref(null)
		let paragraph = ref(null)
		let header = ref(null)
		let image = ref(null)

		onMounted( () => {
			console.log(props)
		})

		let addContent = (hashId, index, emit) => {
			// console.log(field.value)
			// return
			let data = {}

			if (select.value == "img") {
				// console.log(JSON.parse(JSON.stringify(field.value)))
				query.addToPost({
					file: field.value.file,
					caption: field.value.caption
				}, hashId, index,"img").then( resp => {
					// console.log(resp)
					server(resp).then(resp2 => {
						// console.log(resp2)
						emit('contentadded',{hashId});
					})
				})
			}
			else {
				query.addToPost({content: field.value}, hashId, index, select.value).then(resp => {
					// console.log(resp)
					// return;
					server(resp).then(resp2 => {
						// console.log(resp2)
						emit('contentadded',{hashId});
					})
				})
			}
		}

		let selecting = (val) => {
			// console.log(val)
			select.value = val
			
			if(val == "img")field.value = {file: null, caption: ""};
			else field.value = "";
		}

		watch( () => select.value, (now, old) => {
			// console.log("select", now, old)
		}, {deep: true} )

		return {
			select,
			addContent,
			selecting,
			field,
			props

		}
	}
}