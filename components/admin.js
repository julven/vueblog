const  Admin = {
	template: `
		<div>
			<h1>Admin </h1>
			<div>
				<p> 
				<router-link to="/admin"> Home </router-link> |
				<router-link to="/admin/list"> List </router-link> |
				<router-link to="/admin/account"> Account </router-link> |
				<a href="#/" @click="logout">Logout</a>
				</p>

			</div>
			<router-view />
		</div>
	`,
	setup () {

		let {server} = services();
		let store = Vuex.useStore();
		let router = VueRouter.useRouter();

		Vue.onMounted( () => {

			let category = [
				"possibility",
				"charity",
				"literature",
				"device",
				"guidance",
				"permission",
				"throat",
				"power",
				"republic",
				"conclusion",
				"environment",
				"contribution",
				"chapter",
				"estate",
				"blood",
				"performance",
				"queen",
				"tea",
				"security",
				"establishment",
				"product",
				"song",
				"girlfriend",
				"storage",
				"week",
				"video",
				"collection",
				"atmosphere",
				"lake",
				"uncle",
				"intention",
				"photo",
				"lab",
				"scene",
				"reaction",
				"outcome",
				"player",
				"excitement",
				"boyfriend",
				"history",
				"opinion",
				"data",
				"candidate",
				"membership",
				"personality",
				"county",
				"independence",
				"control",
				"equipment",
				"assumption",

			];
			
			// for( let i = 33; i < 119; i++ ) {
			// 	let x = Math.ceil(Math.random() * 3);
			// 	let yy = []
			// 	let index = null

			// 	for(let ii = 0; ii < x; ii++) {
			// 		let index = Math.ceil(Math.random()*49)
			// 		if(yy.includes(index)){
			// 			ii--;
			// 			continue;
			// 		} 
			// 		// yy.push(index)

			// 		server({
			// 			write2: {
			// 				post_category: [
			// 					"insert into post_category set post_category_post_id = ?,"+
			// 					"post_category_category_id = ?",
			// 					"ii",
			// 					[i, index]
			// 				]
			// 			}
			// 		})

			// 	}
			// 	console.log(yy)
			// }

		})
		

		let logout = () => {

			store.dispatch("admin/action", {action: "logout", payload: null}).then(()=>{
				console.log(store.state.admin)
			})
			
		}

		return {
			logout
		}
	}
			// console.log(category.
}