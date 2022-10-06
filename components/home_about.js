let HomeAbout = {

	template: `
		<div class="container">
			<div class="row justify-content-center mb-5">
				<div class="col-12">
					<div class="text-center mt-4">
						<h1 class="mb-0">Vue Blog</h1>
						<small class="text-muted">blog site portfolio by julven</small>
						<div class="d-flex justify-content-center flex-wrap mt-3">
							<div style="max-width:45px; max-height: 45px;" v-for="x in img">
								<img  class="px-1 " :src="x" :alt="x" style="width: 100%;"/>
							</div>
							
							
						</div>
					</div>
				</div>
				
			</div>
			<div class="row justify-content-center">
				<div class="col-9 col-sm-6 col-md-5 col-lg-4 mb-5" >
					<div style="max-width: 250px" class="d-flex mx-auto" >
						<img class="shadow rounded mt-sm-5"
						src="source/mug.jpg" alt="..." style="width: 100%;"/>
					</div>
				</div>
				<div class="col-9 col-sm-6 col-md-5 col-lg-4 mb-5">
					<h1 class="mb-0">Julven Condor</h1>
					<hr class="my-0"/>
					<p class="mt-1 text-muted">Freelance Web Developer</p>

					<p class="">
						This blog website portfolio is created using Vue 3 and web 
						technologies such as html, javascript, css, 
						php, mysql, and bootstrap 5.
					</p>

					<div>
					<p class="lead mb-0">Information</p>
					<p>
						website: <br/> 
						<ul>	
							<li>
								<a href="https://julven.000webhostapp.com">julven.000webhostapp.com </a>
							</li>
						</ul>
						
						
					</p>
					<p>
						email: <br/>
						<ul>
							<li>julven_condor@yahoo.com</li>
							<li>julvenici@gmail.com</li>
						</ul>	
						
					</p>
					<p>
						contact: <br/>	
						<ul>
							<li>+63 927 430 9542</li>
							<li>+1 513 204 9856</li>
						</ul>

					</p>
				</div>
				</div>
				
			</div>
		</div>
	`,
	setup () {

		let { ref, onMounted } = Vue;

		let img = ref([
			"source/html.png",
			"source/css.png",
			"source/javascript.png",
			"source/php.png",
			"source/mysql.png",
			"source/bootstrap.png",
			
			])

		onMounted( () => {

		})

		return {
			img

			
		}
	}
}