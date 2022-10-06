const AdminListAddParagraph = {
	props: ['data'],
	template: `
		<div>
			paragraph({{data.id}}) <a href="#/" @click="e => emitDelete(e, $emit)">x</a> |
			
			<a href="#/" @click="e => emitChangeIndex(e, $emit, 'up')">-</a> |
			<a href="#/" @click="e => emitChangeIndex(e, $emit, 'down')">+</a> 
			<br/>
			<textarea :value="data.value" @change="e => data.value = e.target.value" />
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
