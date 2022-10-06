
const  AdminListAdd = {

	template: `
		<div>
			<h3> List Add</h3>
			<div>
				title <input :value="firstContent[0].value" 
				@change="e=> firstContent[0].value = e.target.value"/>
			</div>
			<div> 
				<img src=""/> <br/>
				image <input type="file" accept="image/png, image/gif, image/jpeg"
				@change="e => firstContent[1].value = e.target.files[0]"/><br/>
				caption <input :value="firstContent[1].cap"
				@change="e=> firstContent[1].cap = e.target.value"/>
			</div>
			<div>
				paragraph <br/>
				<textarea :value="firstContent[2].value"
				@change="e=> firstContent[2].value = e.target.value"/>
			</div>
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

			<select ref="choose">
				<option value="p">paragraph</option>
				<option value="img">image</option>
				<option value="h3">header</option>
			</select> <button @click="setContent">Add</button> <br>
			<button @click="addContent">Submit</button>
			<button @click="() => router.go(-1)"> Back </button>
		</div>
	`,
	setup () {
		let { server } = services();
		let randId = () => Math.random().toString(36).slice(2, 7);
		let { ref, watch } = Vue;
		let router = VueRouter.useRouter();
		let {state } = Vuex.useStore();
		let firstContent = ref([
			{type: "h1", value: "", id: randId()},
			{type: "img", value: null, cap: "", id: randId() },
			{type: "p", value: "", id: randId()},
			])
		let choose = ref(null)
		let content = ref([])

		

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

		let addContent = async () => {

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

			Promise.all(servers.map( func => func())).then(resp => {
				alert("post submitted")

			})

		}

		watch(() => content.value, (now, old) => {
			console.log(now)
		}, {deep: true})



		return {
			choose,
			content,
			setContent,
			deleteContent,
			addContent,
			router,
			changeIndex,
			firstContent
		}
	},
	beforeRouteLeave( to, from) {
		const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  		if (!answer) return false
	}
}