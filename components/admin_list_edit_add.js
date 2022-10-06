let AdminListEditAdd = {
	
	template: `
		<div>

			<div v-if="select=='p'">
				add paragraph <br/>
				<textarea @change="e=>field = e.target.value"/>
			</div>
			<div v-if="select=='img'">
				add image<br/>
				<input type="file" @change="e=>field['file'] = e.target.files[0]"/><br/>
				caption<br/>
				<input @change="e=>field['caption'] = e.target.value"/>
			</div>
			<div v-if="select=='h3'">
				add header<br/>
				<input @change="e=>field = e.target.value"/>
			</div>
			<select  @change="e=>selecting(e.target.value)">
				<option value="p">paragraph</option>
				<option value="img">image</option>
				<option value="h3">header</option>
			</select> 
			<button @click="addContent(props.post.post_hash_id, props.content_length, $emit)">Add</button> <br>
			
			

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