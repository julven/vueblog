const  AdminAccount = {
	template: `
		<div class="row">
			<div class="col-12">
				<h2>Account</h2>

			</div>
			<div class="col-9 col-sm-7 col-md-6 col-lg-5">
				<div class="card mb-3 shadow-sm">
				  <div class="card-body">
				    <h4 class="mb-1">Information</h4>
				    <hr class="mt-0"/>
				    <div style="max-width: 200px">
					    <div class="d-flex justify-content-between" >
					    	<p class="mb-0">Username:</p>
					    	<p class="mb-0 text-muted fw-bold"> {{account.admin_username}}</p>
					    </div>

					    <div class="d-flex justify-content-between">
					    	<p class="mb-0">ID:</p>
						   	<p class="mb-0 text-muted fw-bold">{{account.admin_id}} </p>
					     </div>
				     </div>
				   	
				   	<div class="mb-1">
					  <label  class="form-label mb-0" >First Name</label>
					  <input :value="account.admin_fname" 
					  @change="e => account.admin_fname = e.target.value"
					  type="text" class="form-control" placeholder="first name....">
					</div>

					<div class="mb-1">
					  <label  class="form-label mb-0" >Last Name</label>
					  <input :value="account.admin_lname" 
					  @change="e => account.admin_lname = e.target.value"
					  type="text" class="form-control" placeholder="last name....">
					</div>

					<div class="mb-1" style="max-width: 200px">
					  <label  class="form-label mb-0" >Birthday</label>
					  <input :value="account.admin_bday"
					  @change="e => account.admin_bday = e.target.value"
					  type="date" class="form-control" >
					</div>

					<div  class="mb-4">
						<p class="mb-0">Gender</p>
						<div class="form-check form-check-inline">
						  <input :checked="account.admin_gender == 'male'"
						  @change="e => account.admin_gender = e.target.value"
						  class="form-check-input" type="radio" name="gender" value="male"/>
						  <label class="form-check-label">Male</label>
						</div>
						<div class="form-check form-check-inline">
						  <input :checked="account.admin_gender == 'female'"
						  @change="e => account.admin_gender = e.target.value"
						  class="form-check-input" type="radio" name="gender" value="female"/>
						  <label class="form-check-label">Female</label>
						</div>
					</div>

					<div class="text-end">
						<button class="btn btn-outline-success " @click="updateInfo">Update</button>
					</div>
				  </div>
				</div>
			</div>

			<div class="col-9 col-sm-7 col-md-6 col-lg-5">
				<div class="card mb-3  shadow-sm">
				  <div class="card-body">
				    <h4 class="mb-1">Password</h4>
				    <hr class="mt-0"/>
		    		<div class="mb-1">
					  <label  class="form-label mb-0" >Old</label>
					  <input :value="newPassword.old" 
					  @change="e=>newPassword.old = e.target.value"
					  type="password" class="form-control" placeholder="old password....">
					</div>

					<div class="mb-1">
					  <label  class="form-label mb-0" >New</label>
					  <input :value="newPassword.now" 
					 @change="e=>newPassword.now = e.target.value"
					  type="password" class="form-control" placeholder="new password....">
					</div>

					<div class="mb-4">
					  <label  class="form-label mb-0" >Confirm</label>
					  <input :value="newPassword.conf" 
					  @change="e=>newPassword.conf = e.target.value"
					  type="password" class="form-control" placeholder="confirm....">
					</div>
					<div class="text-end">
						<button class="btn btn-outline-success " @click="updatePassword()">Update</button>
					  </div>
				  </div>
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