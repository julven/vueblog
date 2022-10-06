let HomeMainMore = {
	template: `
		<div class="" @click.prevent="">
			<h1>More Posts</h1>
			<div class="row my-3 justify-content-center"  v-for="x in props.posts" :key="x.post_id">
			<hr/>
				<div class="col-12 col-sm-8 col-md-9 col-lg-5 align-self-center"  >
					<div style="height: 200px;" class=" mb-lg-2 text-center">
						<img :src="x.post_image" @click="toPost(x)" 
						style="cursor: pointer; max-width: 400px; min-width: 240px"
						  class="own-img-cover rounded shadow-sm"/>
					</div>
				</div>

				<div class="col-12 col-sm-10 col-md-10 col-lg-7 " >
					<div class=" mx-1 mx-sm-3 ms-md-3 my-3">
						<h5 class="text-capitalize"  style="cursor: pointer" @click="toPost(x)">{{x.post_title}}</h5>
					    <h6 class="mb-0 text-muted text-capitalize"> 
					    	By <span class="fw-bold">{{x.admin}}</span>
					    </h6>
					    <small > {{time(x.post_date)}}</small>
					    <div class="own-line-clamp2" style="text-align: justify; line-height: 22px">
					    	<p class="mt-2 ">{{x.post_paragraph}}</p>
					    </div>
					    
					    <a href="/" class="" @click="toPost(x)">Read More...</a> 
					    <p>
					    views: 
					    <span class="fw-bold text-muted">{{x.post_view}}</span> <br/>
					    category: 
					    <span v-for="(xx, ii) in x.category" 
					    class="badge bg-success rounded-pill me-1">
					    	{{xx.category_name}}
					    </span> 
					    
					    </p> 
					    
					</div>
				</div>

			</div>
			<hr/>
			<div class="d-grid gap-2 mb-3">
				<button type="button" class="btn  btn-outline-success btn-lg"
				@click="router.push('/posts')">View All</button>
			</div>
			
		</div>
	`,
	props: ['posts'],
	setup(props) {

		let {}  = Vue;
		let router = VueRouter.useRouter();
		let { addViews } = services();

		let toPost = (x) => {
			console.log("go to post "+x.post_id);
			router.push("/post/"+x.post_hash_id);
			addViews(x.post_hash_id);
		}


		return 	{
			props,
			toPost,
			time: (date) => moment(date).format('MMM D, YYYY'),
			router
		}
	}
}