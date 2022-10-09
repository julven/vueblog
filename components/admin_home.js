const AdminHome = {
	template: `
		<div class="mt-3">
			<h2>Home</h2>
			<div class="row justify-content-center">
				<div class="col-12 col-sm-6 col-md-5 col-lg-4">
						<div class="card mb-3" style="max-width: 300px">
						  <div class="card-body" >
						    <h5 class="card-title">Admin Info</h5>
						    <hr class="mt-0"/>
						    
						   	<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">Username:</p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			{{vuex.admin_username}}
						   		</p>
						   	</div>

					   		<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">ID:</p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			{{vuex.admin_id}}
						   		</p>
						   	</div>

						   	<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">Name:</p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			{{vuex.admin_fname}} {{vuex.admin_lname}}
						   		</p>
						   		
						   	</div>

						   	<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">Gender: </p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			{{vuex.admin_gender}}
						   		</p>
						   	</div>

						   	<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">Birthday: </p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			{{time(vuex.admin_bday)}}
						   		</p>
						   	</div>
							    <router-link to="/admin/account">View</router-link>
						  </div>
							
						</div>
				</div>
				<div class="col-12 col-sm-6 col-md-5 col-lg-4">
						<div class="card mb-3 " style="max-width: 300px" >
						  <div class="card-body">
						    <h5 class="card-title">List Summary</h5>
						    <hr class="mt-0"/>
						    
						   	<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">Total:</p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			{{summary.total}}
						   		</p>
						   	</div>

					   		<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">Archived: </p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			{{summary.archive}}
						   		</p>
						   	</div>

						   	<div class="d-flex flex-wrap" style="max-width: 200px">
						   		<p class="mb-1">Categories::</p>
						   		<p class="mb-1 ms-auto ms-sm-auto fw-bold text-capitalize">
						   			 {{summary.categories}}
						   		</p>
						   		
						   	</div>

						   	<router-link to="/admin/list">View</router-link>
						  </div>
						</div>
				</div>

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
			summary,
			time: (date) => moment(date).format('MMM D, YYYY '),
		}
	}
}