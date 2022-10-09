
const AdminListAddImage = {
	props: ['data'],
	template: `
		<div  class="mb-2"> 
	

			<div class="mb-1">
			  <label  class="form-label mb-0">
			  	Image File({{data.id}})

				<a  href="#/" @click="e => emitChangeIndex(e, $emit, 'up')">top</a> |
				<a href="#/" @click="e => emitChangeIndex(e, $emit, 'down')">down</a> |
				<a href="#/" @click="e => emitDelete(e, $emit)">close</a> 

			  </label>
			  <input  accept="image/png, image/gif, image/jpeg" 
			 	@change="e => data.value = e.target.files[0]"
			  class="form-control" type="file" >
			</div>

			<div class="mb-1">
			  <label class="form-labe mb-0">Image Caption</label>
			  <input :value="data.cap" 
			 @change="e => data.cap = e.target.value"
			  type="text" class="form-control"  placeholder="image caption...">
			</div>
		</div>
	`,
	setup ({data}) {
		let id = Vue.ref(data.id)
		let emitDelete = (e, emit) => {
			e.preventDefault();
			
			emit('deleting', id.value)

		}
		let emitChangeIndex = (e, emit, direction) => {
			e.preventDefault();
			emit('index', {id: id.value, direction})

		}

		// Vue.onMounted( () => console.log(data))
		
		return {
			data,
			emitDelete,
			emitChangeIndex
		}
	}
}
