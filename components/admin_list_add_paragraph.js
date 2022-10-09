const AdminListAddParagraph = {
	props: ['data'],
	template: `
		<div  class="mb-2">
			<div class="mb-1">
			  	<label>
					Paragraph ({{data.id}}) 
					
					<a  href="#/" @click="e => emitChangeIndex(e, $emit, 'up')">top</a> |
					<a href="#/" @click="e => emitChangeIndex(e, $emit, 'down')">down</a> |
					<a href="#/" @click="e => emitDelete(e, $emit)">close</a> 
				</label>
			  <textarea :value="data.value"
			 	@change="e => data.value = e.target.value"
			  class="form-control" rows="3" placeholder="paragraph..."></textarea>
			</div>
		

		</div>
	`,
	setup ({data}) {

		let id = Vue.ref(data.id)
		// Vue.onMounted( () => console.log(data))

		let emitDelete = (e, emit) => {
			e.preventDefault();
			
			emit('deleting', id.value)

		}
		let emitChangeIndex = (e, emit, direction) => {
			e.preventDefault();
			emit('index', {id: id.value, direction})

		}

		Vue.onMounted(()=> console.log(id.value))

		return {
			data,
			emitDelete,
			emitChangeIndex
		}
	}
}
