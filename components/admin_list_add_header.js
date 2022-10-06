
const AdminListAddHeader = {
	props: ['data'],
	template: `
		<div> 
			<div>
				header({{data.id}}) <a href="#/" @click="e => emitDelete(e, $emit)">x</a> |
			
			<a href="#/" @click="e => emitChangeIndex(e, $emit, 'up')">-</a> |
			<a href="#/" @click="e => emitChangeIndex(e, $emit, 'down')">+</a> <br/>
				<input :value="data.value" @change="e => data.value = e.target.value"/>
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
