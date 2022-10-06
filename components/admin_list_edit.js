const  AdminListEdit = {
	template: `
		<div v-if="loaded">
			<h3> Post Edit </h3>
			category: <br/>
			<span v-for="x in postTitle.category">
				{{x.category_name}}  
				<a href="#/" title="delete" @click.prevent="deleteCategory(x.category_id)">x</a> <br/>
			</span> 

			<admin_list_edit_category 
			:post_id="postTitle.post_id"
			:categories="postTitle.category"  
			@reloadPost="reload()"/>

			id: {{postTitle.post_hash_id}} <br/>
			admin: {{postTitle.admin}} <br/>
			date: {{time(postTitle.post_date)}} <br/>
			title 
			<span @click="e => e.preventDefault()">
				
				<a title="update" href="#/" @click="update(postTitle)">!!</a> <br/>
			</span>
			
			<input :value="postTitle.post_title" 
			@change="e=>postTitle.post_title = e.target.value"/>

			<div v-for=" (x,i) in postData" :key="x.paragraph_id || x.image_id || x.header_id">
				
				
				<div v-if="x.paragraph_id" :key="x.paragraph_id">

					paragraph({{x.paragraph_id || x.image_id || x.header_id}}) |
					<span @click="e=>e.preventDefault()">
						<a title="move up" href="#/" @click="move(x, 'up')">-</a> |
						<a title="move down" href="#/" @click="move(x, 'down')">+</a> |
						<a title="delete" href="#/"  @click="deleteContent(x.paragraph_id, 'p')">x</a> |
						<a title="update" href="#/" @click="update(x)">!!</a> <br/>
					</span>
					<textarea :value="x.paragraph_content" 
					@change="e=>x.paragraph_content = e.target.value"/> 
				</div>
				<div v-if="x.image_id" :key="x.image_id">
					image({{x.paragraph_id || x.image_id || x.header_id}}) |
					<span @click="e => e.preventDefault()">
						<a title="move up" href="#/" @click="move(x, 'up')">-</a> |
						<a title="move down" href="#/" @click="move(x, 'down')">+</a> |
						<a title="delete" href="#/"  @click="deleteContent(x.image_id, 'img')">x</a> |
						<a title="update image" href="#/"
						@click="newImage['image_'+x.image_id].click()">!!</a> <br/>
					</span>
					<div style="width: 200px" ref="showImage">
						<img :src="x.image_path" :alt="x.image_path" style="width: 100%"/><br/>
					</div>
					<input type="file" accept="image/png, image/gif, image/jpeg"
					:ref="e=>newImage['image_'+x.image_id]=e" 
					hidden @change="e=>imageUpdate(e, x.image_id)"/>

					<input :value="x.image_caption" @change="e=>x.image_caption=e.target.value"/> 
					<span @click="e=>e.preventDefault()"> 
						<a title="update caption" href="#/" @click="e=>imageUpdate(x)">!!</a>
					</span>
				</div>
				<div v-if="x.header_id" :key="x.header_id">
					header({{x.paragraph_id || x.image_id || x.header_id}}) |
					<span @click="e => e.preventDefault()">
						<a title="move up" href="#/" @click="move(x, 'up')">-</a> |
						<a title="move down" href="#/" @click="move(x, 'down')">+</a> |
						<a title="delete" href="#/" @click="deleteContent(x.header_id,'h')">x</a> |
						<a title="update" href="#/" @click="update(x)">!!</a> <br/>
					</span>
					<input :value="x.header_content"
					@change="e=>x.header_content = e.target.value"/>
				</div>
			</div>
			<admin_list_edit_add 
			@contentadded="e => loadPost(e.hashId)"
			:post="postTitle"
			:content_length="postData.length"/>

			<button @click="router.go(-1)"> back</button> 
			<button @click="changeStatus(postTitle.post_id, false)" 
			v-if="postTitle.post_status=='active'"> archive</button> 
			<button @click="changeStatus(postTitle.post_id, true)" 
			v-else> activate</button> 
		
		</div>
	`,
	setup () {

		let { server } = services();
		let { onMounted, ref, computed, reactive } = Vue;
		let {params} = VueRouter.useRoute();
		let router = VueRouter.useRouter();
		let postHashId = ref("");
		let loaded = ref(false);

		let postTitle = ref({})
		let postData = ref([]);
		let postId = ref("")
		let newImage = ref([])
		let showImage = ref(null)

		onMounted( async () => {
			// console.log("id" in params)
			// return
			if(!("id" in params) && params.id == "") {
				router.replace("/admin/list");
				return;
			}
			postHashId.value = params.id
			loadPost(params.id)
			
			
		})

	

		let loadPost = async (hashId) => {
			loaded.value = false;

			let post = await query.getPost2(hashId);
			let paragraph = await query.getContent(hashId, "paragraph");
			let image = await query.getContent(hashId, "image");
			let header = await query.getContent(hashId, "header");
			
			Promise.all([
				server(post),
				server(paragraph),
				server(image),
				server(header),
				
			]).then( async (resp) => {



				

				if(resp[0] == null) {
					router.replace("/admin/list");
					return;
				}
				
				// let arrLen = resp[1].length+resp[2].length+resp[3].length;
				// let arrLen = 0;

				postTitle.value = resp[0][0];

				let category = await query.getPostCategory(postTitle.value.post_id)
				let category_resp = await server(category)

				postTitle.value.category = category_resp;
				// console.log( category_resp)
				// return;

				// console.log(postTitle.value);
				// for(var i = 0; i < arrLen; i++) postData.value.push({});
				let arrContent = [];
				
				// arrContent = resp[1].concat(resp[2], resp[3])
				if(resp[1] != null) arrContent =  [...arrContent, ...resp[1] ]
				if(resp[2] != null) arrContent =  [...arrContent, ...resp[2] ]
				if(resp[3] != null) arrContent =  [...arrContent, ...resp[3] ]
				arrContent.forEach( x => {
					// console.log(xx)		
					let p = "paragraph_index";
					let img = "image_index";
					let h3 = "header_index";

					if(Object.keys(x).includes(p)) {
						x['index'] = x[p];
						// postData.value[xx[p]] = x;
					}
					if(Object.keys(x).includes(img)) {
						x['index'] = x[img];
						// postData.value[xx[img]] = x;
				
					} 	
					if(Object.keys(x).includes(h3)) {
						x['index'] = x[h3];
						// postData.value[xx[h3]] = xx;
					}	
					
				})
				
				arrContent.sort((a,b) =>  a.index  - b.index )
				postData.value = arrContent			
				
				loaded.value = true;
			
			})
		}

		let test = (e) => {
			console.log(newImage.value)
		}

		let imageUpdate = (value, id) => {
			// console.log(!("image_id" in value));
			// return;
			let conf = window.confirm("update selected info?")
			if(conf) {
				
				if(!("image_id" in value)) {
					// console.log("file");
					// return;
					// console.log(newImage.value[0].files[0])
					query.updateImage(
						value.target.files[0],
						id,
						"file"
					).then( resp => {
						server(resp).then( resp2 => {
							loadPost(postHashId.value)
						});
						// console.log(resp)
					})
				}
				else {
					// console.log("image");
					// return;
					query.updateImage(value.image_caption,value.image_id,"image").then( resp =>{
						// console.log(JSON.stringify(resp))
						server(resp).then( resp2 => {
							// console.log(resp2)
							// window.location.reload(); 


							if(resp2.affected_rows > 0) {

							} else {

							}
						})
					})

				} 
			}
			
		}

		let update = async (x) => {
			let type = null;
			let table = "";
			// console.log("paragraph_id" in x,"header_id" in x,"post_id" in x);
			

			let conf = window.confirm("update selected info?")
			if(conf) {
				if("paragraph_id" in x){
					table = "paragraph";
					type = await query.updateParagraph(x);
				} 
				else if ("header_id" in x) {
					table = "header";
					type = await query.updateHeader(x);
				} 
				else if ("post_id" in x) {
					table = "post"
					type = await query.updatePost(x);
				} 
				
				server(type).then(resp2 => {
					if(table == "post") store.dispatch('post/action', {action: "setPost", payload: x})
					loadPost(postHashId.value)
					
				})
				
			}
		}

		let move = (data, type) => {

			let conf = window.confirm("move selected content?")
			if(!conf) return
		
			let getField = (value) => {
				let field = "";
				if("paragraph_id" in value) field="paragraph";
				if("image_id" in value) field="image";
				if("header_id" in value) field="header";

				return field;
			}
			
			// console.log(field)
			let dataIndex = data[getField(data)+"_index"];
			let data1 = null;
			let data2 = null;
		

			if(type == "up") {
				if(dataIndex > 0) {
					data1 = postData.value[dataIndex];
					data2 = postData.value[dataIndex - 1];
					console.log({move_up:[data1, data2]})
					
				} else {
					console.log("already first")
					return;
				}
			}
			else {
				if(dataIndex < postData.value.length - 1) {
					data1 = postData.value[dataIndex];
					data2 = postData.value[dataIndex + 1];
					console.log({move_down:[data1, data2]})
				} else {
					console.log("already last")
					return;
				}
			}
				let query1 = query.indexShuffle(
					data1[getField(data1)+"_id"],
					data2[getField(data2)+"_index"],
					getField(data1)
				);
				let query2 = query.indexShuffle(
					data2[getField(data2)+"_id"],
					data1[getField(data1)+"_index"],
					getField(data2)
				);
			
				Promise.all([
					server(query1),
					server(query2)
				]).then( resp => {
			
					loadPost(postHashId.value)
					
						
				})	

		}

		let changeStatus = (x, status) => {
			
			let conf = window.confirm((status? "activate":"archive")+" selected post?")
			if(conf) {
				// console.log(x, status)
				query.changePostStatus(x, status).then( resp => {
					// console.log(resp)
					// return
					server(resp).then( resp2 => {
						
						postTitle.value.post_status = status? "active": "archive";
						console.log({status: postTitle.value})
						store.dispatch('post/action', {action: "setPost", payload: postTitle.value})
						loadPost(postHashId.value)
					})
				})
			}
		}

		let deleteContent = (id, type) => {
			let conf = window.confirm("delete selected content?")
			let theType = type == "p" ? "paragraph" : type == "img" ? "image" : "header"
			if(conf) {
				// console.log(id)
				query.deleteContent(id, theType).then( resp => {
					// console.log(resp)
					server(resp).then(resp2 => {
						loadPost(postHashId.value)
						// console.log(resp2)
						// window.location.reload(); 
					})
				})
			}
			
		}

		let reload = () => {
			// console.log()
			loadPost(postTitle.value.post_hash_id)
		}

		let deleteCategory = async (x) => {
			// console.log(x, postTitle.value.post_id)

			let conf = window.confirm("delete this post category?")
			if(conf) {
				let statement = await query.deletePostCategory({
					post_category_category_id: x,
					post_category_post_id: postTitle.value.post_id
				});

				// console.log(statement)
				// return
				let resp = await server(statement)

				console.log(resp)
				loadPost(postTitle.value.post_hash_id)
			}
			

			

		}	

		return {
			postTitle,
			postData,
			time: value => moment(value).format('MMM D, YYYY H:mm a '),
			newImage,
			test,
			showImage,
			imageUpdate,
			update,
			move,
			router,
			changeStatus,
			loaded,
			deleteContent,
			loadPost,
			reload,
			deleteCategory
			
		}
	}
}