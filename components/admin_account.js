const  AdminAccount = {
	template: `
		<div >
			<h1> Account</h1>
			<div class="d-flex flex-wrap">
				<div class="m-2">
					<h3>information</h3>
					<p>
						username {{account.admin_username}} <br/>
						id: {{account.admin_id}} <br/>
						first name 
						<input :value="account.admin_fname" 
						@change="e => account.admin_fname = e.target.value"/> <br/>
						last name 
						<input :value="account.admin_lname" 
						@change="e => account.admin_lname = e.target.value"/> <br/>
						birthday 
						<input type="date" :value="account.admin_bday"
						@change="e => account.admin_bday = e.target.value"/> <br/>

						gender <br/> 
						<input type="radio" name="gender"
						value="male" :checked="account.admin_gender == 'male'"
						@change="e => account.admin_gender = e.target.value"/> male 
						<input type="radio" name="gender"
						value="female" :checked="account.admin_gender == 'female'"
						@change="e => account.admin_gender = e.target.value"/> female <br/>

						<button @click="updateInfo">update</button>
					</p>
					
				</div>

				<div  class="m-2">
					<h3>password</h3>
					<p>
						old <input type="password" :value="newPassword.old" 
						@change="e=>newPassword.old = e.target.value"/> <br/>
						new <input type="password" :value="newPassword.now" 
						@change="e=>newPassword.now = e.target.value"/> <br/>
						confirm <input type="password" :value="newPassword.conf" 
						@change="e=>newPassword.conf = e.target.value"/> <br/>
						<button @click="updatePassword()">update</button>
					</p>
				</div>
			</div>
		</div>
	`,
	setup () {

		let {state: {admin}} = Vuex.useStore();
		let { ref, onMounted,  } = Vue;
		let {server} = services();

		let newPassword = ref({
			old: "",
			now: "",
			conf: "",
		})

		let account = ref({
			admin_fname: "",
			admin_lname: "",
			admin_id: "",
			admin_gender: "",
			admin_bday: "",
			admin_username: "",
		});

		let updateInfo = () => {
			console.log(account.value)
			query.updateAdmin(account.value).then(resp => {
				// console.log(resp)
				server(resp).then( resp => {
					alert("update successfull")
					store.dispatch("admin/action", {action: 'setAdmin', payload: account.value})
				})
			})
			// 
		}

		onMounted( () => {
			account.value = {
				...account.value,
				...admin
			}
		})

		let updatePassword = () => {
			
			let {now, old, conf} = newPassword.value;
			
			if(now == "" || old == "" || conf == "") {
				alert("all fields must be filled!");
				return;
			}
			if(now.length < 5) {
				alert("password must be atleast 5 letters minimum");
				return;
			}
			if(now !== conf) {
				alert("new and confirm did not match!");
				return;
			}
			
			query.checkPassword({
				admin_id: account.value.admin_id,
				admin_password: old
			}).then(resp => {
				// console.log(resp)
				server(resp).then( resp2 => {
					// console.log(resp2)
					if(resp2[0].exist > 0) {
						query.updatePassword(now, account.value.admin_id).then(resp3 => {
							// console.log(resp3)

							server(resp3).then(resp4 => {

								if(resp4.affected_rows > 0) {
									alert("password changed successfully")
									newPassword.value.old = "";
									newPassword.value.now = "";
									newPassword.value.conf = "";
									return;
								} else {
									newPassword.value.old = "";
									alert("nothing has changed")
									return
								}
								
							})
						})
					}
					else {
						alert("wrong password!")
						return
					}
				})
			})
			

		}

		return {
			account,
			updateInfo,
			newPassword,
			updatePassword
		}
	}
}