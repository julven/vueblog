let Home = {

	template: `
		<div>
			<home_navbar />
			<div style="height: 66px; background-color: rgba(65, 184, 131)" />
			<div style="min-height: 225px">
				<router-view />
			</div>
			<div class="bg-success bg-gradient">
				
				<home_footer />
			</div>
			
		</div>
	`,
	setup () {

		

		return {


			
		}
	}
}