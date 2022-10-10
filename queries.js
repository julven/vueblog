const query = {
	getHashId: () => Math.random().toString(36).slice(2, 7),
	base64: (file) => {
		return new Promise( resolve => {
			let convert = null;
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				resolve(reader.result)
			}

		})

	},
	writePost2: async (data) => {
		let statement = {
			write2 : {
				post : [
					"insert into post set post_title = ?,"+
					"post_hash_id = ?, post_admin_id = ?, post_status = ?",
					"ssis",
					[data.post_title, query.getHashId(), data.admin_id, "active"]
				]
			}
		}

		return statement;
	},
	writeContent: async (data, type) => {
		let table = type == "p" ? "paragraph":"header";
		let statement = {
			write2: {
				[table] : [
					`insert into ${table} set ${table}_content = ?, `+
					`${table}_index = ?, ${table}_post_hash_id = ?`,
					"sis",
					[data.content, data.index, data.hashId]
				]
			}
		}
		return statement;
	},	
	writeImage: async (data) => {
		let statement = {};
		await query.base64(data.file).then( resp => {
			statement = {
				write2: {
					file : [
						resp,
						"insert into image set image_path = ?, image_caption =?, "+
						"image_post_hash_id = ?, image_index = ?",
						"sssi",
						[null, data.caption, data.hashId, data.index]
					]
				}
			}
		})
		return statement;
	},
	
	getPosts: async (data, guest) => {
		let active = guest ? "and post.post_status = ? ": "";
		let statement = {
			read2: {
				post: [
					"select post.*, admin_blog.admin_username as admin "+
					"from post inner join admin_blog on admin_blog.admin_id = "+
					" post.post_admin_id where post.post_title like ? "+active+
					"order by post.post_date desc limit ?,10",
					"si",
					[`%${data.search}%`, (data.page - 1)*10]
				]
			}
		}
		if(guest) {
			statement.read2.post[1] = "ssi"
			statement.read2.post[2] = [`%${data.search}%`,'active', (data.page - 1)*10]
			let guestStatement = {
				guest: "",
				...statement
			}

			return guestStatement
		}
		return statement;
	},

	getPost2: async (hashId, guest) => {
		let statement = {
			read2: {
				post : [
					"select p.*, a.admin_username as admin "+
					"from post p inner join admin_blog a on p.post_admin_id = a.admin_id "+
					"where post_hash_id = ? ", 
					"s", 
					[hashId]
				]
			}
			
		}
		if(guest) {
			let guestStatement = {
				guest: "",
				...statement
			}
			return guestStatement
		}

		return statement;
	},
	getContent: async (hashId, table, guest ) => {
		let statement = {
			read2: {
				[table] : [`select * from ${table} where ${table}_post_hash_id = ?`, "s", [hashId]]
			},
		}

		if(guest) {
			let guestStatement = {
				guest: "",
				...statement
			}
			return guestStatement
		}

		return statement;
	},
	deletePostAndAll:async (hashId) => {
		let statement = {
			delete: {
				post: [
					"delete post, image, paragraph, header, post_category from post "+
					"inner join paragraph on post.post_hash_id = paragraph.paragraph_post_hash_id "+
					"inner join image on post.post_hash_id = image.image_post_hash_id "+
					"inner join header on post.post_hash_id = header.header_post_hash_id "+
					"inner join post_category on post.post_id = post_category.post_category_post_id "+
					"where post.post_hash_id = ?",
					"s",
					[hashId]
				]
			}
		}

		return statement
	},
	deletePostAndEach: (hashId, table) => {

		let modify = () => {
			let modified = ""
			if(table == 'post') {
				modified = "post_hash_id";
			}
			else modified = `${table}_post_hash_id`;

			return modified
		}

		let statement = {
			delete: {
				[table] : [
					`delete from ${table} where ${modify()} = ?`,
					"s",
					[hashId]
				]
			}
		}
		return statement
	},

	updateImage: async (data, id, type) => {
		let statement = {};

		if(type == "file") {
			await query.base64(data).then( resp => {
				statement = { 
					edit: { 
						file: [
							resp,
							"update image set image_path = ? where image_id = ?",
							"si",
							[null, id]
						]
					}
				};
			})
			
		}
		else statement = { 
			edit: { 
				image: [
					"update image set image_caption = ? where image_id = ?",
					"si",
					[data, id]
				]
			}
		}
		// console.log(statement)
		return statement;
	},
	updateParagraph: async (data) => {
		let statement = {
			edit: {
				paragraph: [
					"update paragraph set paragraph_content = ? where paragraph_id = ?",
					"si",
					[data.paragraph_content, data.paragraph_id]
				]
			}
		}

		return statement;
	},
	updateHeader: async (data) => {
		let statement = {
			edit: {
				header: [
					"update header set header_content = ? where header_id = ?",
					"si",
					[data.header_content, data.header_id]
				]
			}
		}

		return statement;
	},
	updatePost: async (data) => {
		let statement = {
			edit: {
				post: [
					"update post set post_title = ? where post_id = ?",
					"si",
					[data.post_title, data.post_id]
				]
			}
		}

		return statement;
	},
	indexShuffle : (id, index, type) => {

		let statement = {
			edit: {
				[ type ] : [
					"update "+type+" set "+type+"_index = ? where "+type+"_id = ?",
					"ii",
					[ index, id ]
				]
			}
		}

		return statement;
	},
	addToPost: async (data, dataHashId, index, type) => {
		// console.log({data, dataHashId, index, type});
		// return;
		let statement = {};
		if(type=="img") {
			let image = await query.base64(data.file)
			statement = {
				write2 : {
					file: [
						image,
						"insert into image set image_path=?, image_caption=?, "+
						"image_index=?, image_post_hash_id=?",
						"ssis",
						[null,data.caption,index,dataHashId]
					]
				}
			}
			return statement;
		}
		else {
			let field = type=="p"?"paragraph":"header";
			let statement = {
				write2: {
					[field] :[
						"insert into "+field+" set "+field+"_content=?,"+
						field+"_index=?,"+field+"_post_hash_id=?",
						"sis",
						[data.content, index, dataHashId]
					]
				}
			}
			return statement; 	
		}

		
	},
	changePostStatus: async (id, status) => {

		let statement = {
			edit: {
				post: [
					"update post set post_status = ? where post_id = ?",
					"si",
					[status ? "active":"archive", id]
				]
			}
		}

		return statement
	},
	deleteContent: async (id, type) => {

		let statement = {
			delete: {
				[type] : [
					"delete from "+type+" where "+type+"_id = ?",
					"i",
					[id]
				]
			}
		}

		return statement;
	},
	postSummary:async  () => {
		let statement = {
			read2: {
				post: [
					"select count(*) as total,"+
					"count(case when post_status = 'archive' then 1 end) as archive "+
					"from post",
					"",
					[]
				]
			}
		}
		return statement;
	},
	totalCategory: async () => {
		let statement = {
			read2: {
				post: [
					"select count(*) as categories from category",
					"",
					[]
				]
			}
		}
		return statement;
	},
	checkPassword: async (data) => {
		let statement = {
			read2: {
				admin: [
					"select count(*) as exist from admin_blog "+
					"where admin_id = ? and admin_password = ?",
					"is",
					[data.admin_id, data.admin_password]
				]
			}
		}
		return statement;
	},
	updatePassword : async (password, id) => {
		let statement = {
			edit: {
				admin :[
					"update admin_blog set admin_password = ? where admin_id = ?",
					"si",
					[password, id]
				]
			}
		}
		return statement
	},
	updateAdmin:async (data) => {
		let statement = {
			edit: {
				admin :[
					"update admin_blog set admin_fname = ?, "+
					"admin_lname = ?, admin_bday = ?, "+
					"admin_gender = ? where admin_id = ?",
					"ssssi",
					[
						data.admin_fname,
						data.admin_lname,
						data.admin_bday,
						data.admin_gender,
						data.admin_id
					]
				]
			}
		}
		return statement;
	},
	getPopularPosts: async () => {
		let statement = {
			guest: "",
			read2: {
				post: [
					"select a.admin_username as admin_username, p.* from post p "+
					"inner join admin_blog a on p.post_admin_id = a.admin_id "+
					"order by p.post_view desc limit 3",
					"",
					[]
				]
			}
		}

		return statement
	},
	addViews :  (hashId) => {
		let statement = {
			
			view : [
				"update post set post_view = post_view + 1 where post_hash_id = ?",
				"s",
				[hashId]
			]
			
			
		}
	
		return statement;
	},
	addPostCategory: async (data) => {
		let statement = {
			write2: {
				post_category: [
					"insert into post_category set post_category_post_id = ?,"+
					"post_category_category_id = ?",
					"ii",
					[ data.post_id, data.category_id]
				]
			}
		}

		return statement
	},
	addCategory: async (name) => {
		let statement = {
			write2: {
				category: [
					"insert into category set category_name = ?",
					"s",
					[name]
				]
			}
		}

		return statement;
	},
	readCategory: async (name, guest) => {
		let statement = {
			read2: {
				category: [
					"select * from category where category_name like ? order by category_name",
					"s",
					[`%${name}%`]
				]
			}
		}
		if(guest) {
			statement = {...statement, guest: ""}
		}
		return statement;
	},
	deletePostCategory: async  (data) => {
		let statement = {
			delete: {
				post_category: [
					"delete from post_category where post_category_category_id = ? "+
					"and post_category_post_id = ?",
					"ii",
					[data.post_category_category_id, data.post_category_post_id]
				]
			}
		}

		return statement;
	},
	deletePostCategorySimple: async (id) => {
		let statement = {
			delete: {
				category: [
					"delete from post_category where post_category_category_id = ?",
					"i",
					[id]
				]
			}
		}
		return statement;
	},
	deletePostCategoryByPostId: async id => {
		let statement = {
			delete: {
				post_category: [
					"delete from post_category where post_category_post_id = ?",
					"i",
					[id]
				]
			}
		}
		return statement;
	},
	deleteCategory: async (id) => {
		let statement = {
			delete: {
				category: [
					"delete from category where category_id = ?",
					"i",
					[id]
				]
			}
		}
		return statement;
	},
	getPostCategory: async (post_id, guest) => {
		let statement = {
			read2: {
				post_category: [
					"select c.* from post_category p "+
					"inner join category c on p.post_category_category_id "+
					"= c.category_id where p.post_category_post_id = ?",
					"i",
					[post_id]

				]
			}
		}
		if(guest) {
			statement = {...statement, guest: ""}
		}

		return statement
	},
	getCategory: async (category) => {
		let statement = {
			read2: {
				category: [
					"select * from category where category_name like ?",
					"s",
					[`${category}%`]
				]
			}
		}
		return statement
	},
	getAllCategory: async (guest) => {
		let statement = {

			read2: {
				category: [
					"select * from category order by category_name",
					"",
					[]
				]
			}
		}
		if(guest) {
			statement = {...statement, guest: ""}
		}
		return statement
	},
	getCategoryByCategoryPost: async (id) => {
		let statement = {
			read2: {
				post_category: [
					"select count(*) as count from post_category where post_category_category_id = ?",
					"i",
					[id]

				]
			}
		}
		return statement
	} ,
	getPostsByCategory: async (data) => {
		let statement = {
			guest: "",
			read2: {
				category: [
					"select distinct p.*, a.admin_username as admin from post_category pc "+
					"inner join post p on p.post_id = pc.post_category_post_id "+
					"inner join category c on c.category_id = pc.post_category_category_id "+
					"inner join admin_blog a on a.admin_id = p.post_admin_id "+
					"where c.category_name = ? limit ?,10",
					"si",
					[data.category,  (data.page - 1)*10]
				]
			}
		}

		return statement;
	}

}