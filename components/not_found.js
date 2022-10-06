const NotFound = {
	template: `
		<div class="container ">
			<h2 class="mt-3">Page Not Found</h2>
			<router-link to="/">Home Page</router-link> |
			<router-link to="/login">Admin Login</router-link>
		</div>
	`,
	setup() {

		return {

		}
	}
}