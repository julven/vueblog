let HomeNavbar = {

	template: `
		<div @click="e=>e.preventDefault()">
			<nav class="navbar fixed-top navbar-expand-sm shadow-sm navbar-light" style="background-color: rgba(65, 184, 131, .95) ">
			  <div class="container">
			    <span class="navbar-brand fs-3  text-white "> 
			    	Vue Blog
			    </span>
			    <button class="navbar-toggler " id="navBttn"
			    type="button" data-bs-toggle="collapse" 
			    data-bs-target="#navbarNav" aria-controls="navbarNav" 
			    aria-expanded="false" aria-label="Toggle navigation">
			      <span class="navbar-toggler-icon "></span>
			    </button>
			    <div class="collapse navbar-collapse " id="navbarNav">
			      <ul class="navbar-nav ms-auto" @click="navClick()">
			        <li class="nav-item m-auto">
			          <router-link class="nav-link  fs-5 text-white" aria-current="page" to="/">Home</router-link >
			        </li>
			        <li class="nav-item m-auto">
			          <router-link  class="nav-link  fs-5 text-white" to="/posts">Blogs</router-link >
			        </li>
			        <li class="nav-item m-auto">
			          <router-link  class="nav-link fs-5 text-white" to="/about">About</router-link >
			        </li>
			        
			      </ul>
			    </div>
			  </div>
			</nav>
		</div>
	`,
	setup () {

		let navClick = () => {

			if (document.getElementById("navBttn").ariaExpanded == "true") document.getElementById("navBttn").click();
		}
		

		return {

			navClick

		}
	}
}