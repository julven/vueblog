let HomeMain = {

	template: `
		<div>
			<div v-if="loading" class="d-flex justify-content-center" style="height: 250px">
				<div class="spinner-border text-success align-self-center" role="status" >
				  <span class="visually-hidden">Loading...</span>
				</div>
			</div>
			<div v-else>
				
				<home_main_recent :posts="recentPost" />
				
				
				<div class="container-xl" >

					<div class="row justify-content-center">
						<div class="col-12 col-sm-11 col-md-7 col-lg-7"> 
							<home_main_more :posts="morePost"/>
						</div>

						<div class="col-12 col-sm-11 col-md-4 col-lg-3"> 
							<home_misc />
						</div>
					</div>
			
				</div>
			
			</div>
		</div>
	`,
	setup () {

		let { onMounted, ref, reactive, toRaw, computed, watch } = Vue;
		let {server} = services();
		let store = Vuex.useStore();
		let recentPost = ref([])
		let morePost = ref([])
		let loading = ref(true);

		onMounted( () => {
			query.getPosts({search: "", page: 1}, true).then(resp => {
				// console.log(resp)
				// return;
				server(resp).then( async resp2 => {

					for( let ii = 0; ii < resp2.length; ii++) {
						let postContents = [];
						
						let paragraph = await query.getContent(resp2[ii].post_hash_id, "paragraph", true);
						let image = await query.getContent(resp2[ii].post_hash_id, "image", true);
						let header = await query.getContent(resp2[ii].post_hash_id, "header", true);
						let category = await query.getPostCategory(resp2[ii].post_id, true);

						// console.log(JSON.stringify(category))
						// return

						let [a,b,c,d] = await Promise.all([
							server(paragraph),
							server(image),
							server(header),
							server(category)
						])

						if(a != null) postContents = [...postContents, ...a];
						if(b != null) postContents = [...postContents, ...b];
						if(c != null) postContents = [...postContents, ...c];

						postContents.forEach( (x) => {

							if(Object.keys(x).includes("paragraph_index")) {
								x.index = x['paragraph_index'];
							}
							else if(Object.keys(x).includes("image_index")) {
								x.index = x ['image_index'];
							}
							else {
								x.index = x ['header_index'];
							}
						})

						postContents.sort( (a,b) => a.index - b.index)
					
						
						postContents.every( x => {
							if(Object.keys(x).includes("paragraph_index")) {
								// console.log(x)
								resp2[ii].post_paragraph = x.paragraph_content;
								return false;
							} 
							return true;
						})
						postContents.every( x => {
							if(Object.keys(x).includes("image_index")) {
								// console.log(x)
								resp2[ii].post_image = x.image_path;
								return false;
							} 
							return true;
						})



						resp2[ii].contents = postContents
						resp2[ii].category = d;
					}
				
					
					let [ x, y, z, ...rest] = resp2;
					let [aa,bb,cc,dd,ee, ...rest2] = rest;
					// console.log([x,y,z], rest)
					recentPost.value = [x, y, z];
					morePost.value = [aa,bb,cc,dd,ee];
					loading.value = false
					

				})
			})
		} )

		watch(()=> store.state.viewer,(now,old) => {
			// console.log(now)
		}, {deep: true})

		return {
			recentPost,
			morePost,
			loading
			
		}
	}
}