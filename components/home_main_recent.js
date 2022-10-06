let HomeMainRecent = {

	template: `
		<div @click="e=>e.preventDefault()" class="mb-3 shadow">
			<div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel ">
			  <div class="carousel-indicators">
			    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"
			    ref="startCycle"></button>
			    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
			    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
			  </div>
			  
			  <div class="carousel-inner" >
			    <div :class="'carousel-item '+(i == 0 && 'active')+' own-carousel'" 
			    v-for="(x, i) in props.posts" data-bs-interval="5000">
			      <img :src="x.post_image" class="own-img-cover" alt="...">
			      <div class="carousel-caption text-start px-5 own-caption "
			      @click="toPost(x)">
			      <div class="own-line-clamp" style="cursor: pointer">
			      		
				        <h3 class="mb-0 own-outline text-capitalize">{{x.post_title}}</h3>
				        <small class="text-muted text-capitalize">by {{x.admin}}</small>
				        <div style="line-height: 22px">
				        	<p class="text-light own-outline">{{x.post_paragraph}}</p>
				        </div>
			        </div>
			      </div>
			    </div>
			    
			  </div>
			  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
			    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
			    <span class="visually-hidden">Previous</span>
			  </button>
			  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
			    <span class="carousel-control-next-icon" aria-hidden="true"></span>
			    <span class="visually-hidden">Next</span>
			  </button>
		  </div>
			
		</div>
	`,
	props: ['posts'],
	setup (props) {

		let { addViews } = services();
		let { onMounted, watch, ref } = Vue;
		let router = VueRouter.useRouter()
		let startCycle = ref(null);

		let toPost = (x) => {
			console.log("go to post "+x.post_id)
			router.push("/post/"+x.post_hash_id)
			addViews(x.post_hash_id);
		}

		onMounted( () => {
			

			let el = document.getElementById('carouselExampleCaptions')
			const carousel = new bootstrap.Carousel(el, {
			  interval: 8000,
			})
		})

		watch( () => props, (now, old) => {
			// console.log(now)
		}, {deep: true})
		return {
			props,
			toPost,
			startCycle
		}
	}
}