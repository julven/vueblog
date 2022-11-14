const services = () => {



	const server = (data) => {

	// return console.log(data);

		const SERVER_URL = 'http://localhost/vueblog/server.php';
		// const SERVER_URL = 'https://julven.epizy.com/vueblog/server.php';
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
		// console.log("add view to post "+hashId)
		

		let statement = query.addViews(hashId)
		// console.log(JSON.stringify(statement))
		server(statement).then(resp => {
			console.log({addViews: resp})
		})
	}	

	let validation = (field) => {

		let valid = true
		let empty = []


		field.forEach( (x, i) => {
		
			// console.log(x)
			Object.keys(x).forEach( (xx, ii) => {
				
				if(xx == "value" || xx == "cap") {
					// console.log(x[xx])
					if(x[xx] == "" || x[xx] == null || x[xx] == undefined) {
						empty.push({[xx]: x})
						valid = false
					}
				}
				
			})
		})

		// console.log({valid, empty})
		return valid

	}
	
	return {
		server,
		addViews,
		validation
		
	}

}