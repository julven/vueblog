const services = () => {



	const server = (data) => {

	// return console.log(data);

		const SERVER_URL = 'http://localhost/vueblog/server.php';
		// const SERVER_URL = 'https://julven.000webhostapp.com/vuesample/backend/server.php?route=';
		// const test = () => console.log(store.state.account);

		let form = new FormData();

		Object.keys(data).forEach( x => {
			// console.log(x, JSON.stringify(data[x]))
			form.append(x, JSON.stringify(data[x]))
		});

		let request = {
			method: "POST",
			body: form
		};
		
		if("admin_token" in store.state.admin) {
			request = { 
				...request, 
				headers: new Headers( {
					"token" : store.state.admin.admin_token,
					"id": store.state.admin.admin_id
				} )
			}
		} 

		// console.log(form)

		return new Promise( (resolve, reject) => {
			fetch(SERVER_URL, request)
			.then(resp => resp.text())
			.then(resp => {
				
				console.log(resp);
				
				if(resp == "error_expired_token") {
					store.dispatch("admin/action", { action: "logout", payload :null})
					// Router.push("/login")
					// return;
				}
				try{
					resolve(JSON.parse(resp))

				}catch(err) {
					console.log(err)
					
					
					resolve(false)
				}
				
			}).catch( err  => {
				reject({error: err})
			})
		})
		
	}

	let addViews = (hashId) => {
		console.log("add view to post "+hashId)
		let statement = query.addViews(hashId)
		// console.log(JSON.stringify(statement))
		server(statement)
	}	
	
	return {
		server,
		addViews
		
	}

}