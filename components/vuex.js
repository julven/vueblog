const vuexAdmin = {
		namespaced: true,
		state: {
			logged: false
		},
		getters: {
			state: state => {
				return state;
			}
		},
		mutations: {
			setAdmin: ( state, payload ) => {
				Object.keys(payload).forEach( x => {
					state[x] = payload[x]
				})
			},
			logout : (state, payload) => {
				console.log("logout")
				Object.keys(state).forEach( x => {
					if(x === "logged") state[x] = false;
					else delete state[x];
					Router.push("/login")
				})
				
			}
		},
		actions: {
			action: ( { commit }, { action, payload } ) => {
				return new Promise ( resolve => {
					// console.log(payload)
					commit( action, payload );
					resolve();
				})
			}
		}
	};
	const vuexPost = {
		namespaced: true,
		state: {
			posts: [],
			pages: [1],
			page: 1,
			search: "" ,
			
		},
		getters: {
			state: state => {
				return state;
			}
		},
		mutations: {
			setPosts: (state, payload) => {
				state.posts = payload;	
			},
			setPost: (state, payload) => {
				state.posts.forEach( (x,i) => {
					if(x.post_id == payload.post_id){
						state.posts[i] = payload
					} 
				})
			},
			setPages: (state, payload) => {
				state.pages = payload
			},
			addPages: (state, payload) => {
				state.pages.push(payload)
			},
			setPage: (state, payload) => {
				// console.log(state.page)
				if(payload) state.page = payload;
				else state.page = state.page + 1;
			},
			setSearch: (state, payload) => {
				state.search = payload
			},
			deletePost: (state, payload) => {
				
			}
		},
		actions: {
			action: ( { commit }, { action, payload } ) => {
				return new Promise ( resolve => {
					commit( action, payload );
					resolve();
				})
			}
		}
	};
	const vuexViewer = {
		namespaced: true,
		state: {
			recentPost: [],
			morePost: [],
			loading: false,
			hashId: "",
		},
		getters: {
			state: (state) => {
				
				return state;
			}
		},
		mutations: {
			recentPost: (state, payload) => {
				// console.log(payload)
				state.recentPost = payload
			},
			morePost: (state, payload) => {
				// console.log(payload)
				state.morePost = payload
			},
			setLoad: (state, payload) => {

				state.loading = payload
				// console.log("loading = "+ state.loading)
			},
			setHashId: (state, payload) => {

				state.hashId = payload
				// console.log("loading = "+ state.loading)
			}
		},
		actions: {
			action: ( { commit }, { action, payload } ) => {
				return new Promise ( resolve => {
					// console.log("vuex action")
					commit( action, payload );
					resolve();
				})
			}
		}
	}
	
const store = Vuex.createStore({
	modules: {
		admin: vuexAdmin,
		post: vuexPost,
		viewer: vuexViewer
	}
});