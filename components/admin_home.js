const AdminHome = {
	template: `
		
			<h1> Home</h1>
			<div class="d-flex flex-wrap">
			<div class="m-2">
				<h2>Account Info</h2>
				<p>
					username: {{vuex.admin_username}} <br/>
					id: {{vuex.admin_id}}<br/>
					name: {{vuex.admin_fname}} {{vuex.admin_lname}} <br/>
					sex: {{vuex.admin_gender}} <br/>
					birthday: {{vuex.admin_bday}} <br/>
					<router-link to="/admin/account">view</router-link>

				</p>
			</div>

			<div class="m-2">
				<h2>Post Summary</h2>
				<p>
					total: {{summary.total}} <br/>
					archived: {{summary.archive}}  <br/>
					categories: {{summary.categories}} <br/>
 
					<router-link to="/admin/list">view</router-link>

				</p>
			</div>
		</div>
	`,
	setup () {

		let { watch, computed, onMounted, ref } = Vue;
		let store = Vuex.useStore();
		let { server } = services();
		let { state: { admin } } = store;
		let summary = ref({
			total: 0,
			archive: 0,
			categories: 0
		})

		onMounted( () => {
			query.postSummary().then( resp => {
				server(resp).then(resp2 => {
					// console.log(resp2)
					summary.value.total = resp2[0].total;
					summary.value.archive = resp2[0].archive;
				})
			})
			query.totalCategory().then(resp => {
				server(resp).then(resp2 => {
					summary.value.categories = resp2[0].categories
				})
			})
		})
		
		return {
			vuex: computed( () => admin),
			summary
		}
	}
}