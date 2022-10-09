
const AdminListAddHeader = {
	props: ['data'],
	template: `
		<div class="mb-2"> 
			<div class="mb-1">
			  <label class="form-labe mb-0">
			  	Image Caption ({{data.id}})
		  		<a  href="#/" @click="e => emitChangeIndex(e, $emit, 'up')">top</a> |
				<a href="#/" @click="e => emitChangeIndex(e, $emit, 'down')">down</a> |
				<a href="#/" @click="e => emitDelete(e, $emit)">close</a> 

			  </label>
			  <input :value="data.value"
			  @change="e => data.value = e.target.value"
			  type="text" class="form-control"  placeholder="header...">
			</div>
		</div>
	`,
	setup ({data}) {
		// Vue.onMounted( () => console.log(data))
		let id = Vue.ref(data.id)
		let emitDelete = (e, emit) => {
			e.preventDefault();
			
			emit('deleting', id.value)

		}

		let emitChangeIndex = (e, emit, direction) => {
			e.preventDefault();
			emit('index', {id: id.value, direction})

		}
		return {
			data,
			emitDelete,
			emitChangeIndex
		}
	}
}
