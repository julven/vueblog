
const AdminListAddImage = {
	props: ['data'],
	template: `
		<div> 
			<img src=""/> <br/>
			image({{data.id}}) <a href="#/" @click="e => emitDelete(e, $emit)">x</a> |
			
			<a href="#/" @click="e => emitChangeIndex(e, $emit, 'up')">-</a> |
			<a href="#/" @click="e => emitChangeIndex(e, $emit, 'down')">+</a>  <br/>
			<input type="file" @change="e => data.value = e.target.files[0]"
			accept="image/png, image/gif, image/jpeg"/><br/>
			caption <input @change="e => data.cap = e.target.value"/>
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
