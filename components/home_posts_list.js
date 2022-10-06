const HomePostsList = {

	template: `

		<div class="mb-3" v-for="(x, i) in posts"  :key="x.post_id" v-if="posts.length > 0">
	     <div class="ms-3">

	        <h5 class=" text-capitalize mb-0" @click="router.push('/post/'+x.post_hash_id)" 
	        style="cursor: pointer">{{x.post_title}}</h5>

	        <small class=" mb-0">
	        	Admin: 
	        	<span class="fw-bold text-muted text-capitalize">{{x.admin}}</span> | 
	        	Date: 
	        	<span class="fw-bold text-muted text-capitalize">{{time(x.post_date)}}</span> | 
	        	Views: 
	        	<span class="fw-bold text-muted text-capitalize">{{x.post_view}}</span>
	        </small>
	        <p class="mb-0">
		        Categories: 
		        <span class="badge rounded-pill bg-success me-2 mb-0"
		      	v-for="xx in x.category" >
		        	{{xx.category_name}}
		        </span> 
		        
	        </p>
	        <a href="#/" @click.prevent="router.push('/post/'+x.post_hash_id)"> read blog</a> <br/>
	        <div class="text-end">
	        	<small class="">id: {{x.post_hash_id}}</small>
	        </div>
	        	
	        </div>
	        
	      <hr class="mt-0"/>
	    </div>
	    <p v-else >no results...</p>
	`,
	props: ['data'],
	setup(props) {


		return {
			posts: Vue.computed( () => props.data),
			time: (date) => moment(date).format('MMM D, YYYY '),
			router: VueRouter.useRouter()
		}
	}
}