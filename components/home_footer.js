let HomeFooter = {

	template: `
	<div class="  container-lg pb-4 text-light">

		<div class="row justify-content-center pt-5">
			<div class="col-12 col-sm-12 col-md-3 mb-4 ">
				<div>
					<h1 class="mb-0">Vue Blog</h1>

					<small>blog site portfolio by Julven</small>
				</div>
			</div>

			<div class="col-12 col-sm-12 col-md-4 mb-3">
				<div>
					<p class="fw-bold mb-0">Julven Condor</p>
					<hr class="mt-0">
					<p>
						website: <br/> 
						<ul>	
							<li>
								<a href="https://julven.000webhostapp.com"
								style=" color: white"
								>julven.000webhostapp.com </a>
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

			<div class="col-12 col-sm-12 col-md-2 mb-3 ">
				<div>
					<p class="fw-bold mb-0">Site Links</p>
					<hr class="mt-0">
					<ul >
						<li><router-link to="/" style=" color: white">Home</router-link></li>
						<li><router-link to="/posts" style=" color: white">Posts</router-link></li>
						<li><router-link to="/about" style=" color: white">About</router-link></li>

					</ul>
				</div>
			</div>

			<div class="col-12 col-sm-12 col-md-2 mb-3 ">
				<div class="">
					<div>
						<p class="fw-bold mb-0">Explore</p>
						<hr class="mt-0">
						<ul>
							<li>Facebook</li>
							<li>Github</li>
							<li>Linkdin</li>
							<li>Skype</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
	setup () {



		return {


			
		}
	}
}