const Index =  Vue.createApp(App);

Index.component("nav_page", Nav);
Index.component("admin_login", AdminLogin);
Index.component("admin_home", AdminHome);
Index.component("admin_list", AdminList);
Index.component("admin_list_add", AdminListAdd);
Index.component("admin_list_edit", AdminListEdit);
Index.component("admin_list_edit_add", AdminListEditAdd);
Index.component("admin_list_edit_category",AdminListEditCategory)
Index.component("admin_list_table", AdminListTable);
Index.component("admin_account", AdminAccount);
Index.component("admin_page", Admin);
Index.component("paragraph_comp", AdminListAddParagraph);
Index.component("image_comp", AdminListAddImage);
Index.component("header_comp", AdminListAddHeader);
Index.component("home_page", Home);
Index.component("home_navbar", HomeNavbar);
Index.component("home_posts", HomePosts);
Index.component("home_posts_category", HomePostsCategory);
Index.component("home_posts_list", HomePostsList);
Index.component("home_post", HomePost);
Index.component("home_view_post", HomeViewPost);
Index.component("home_main", HomeMain);
Index.component("home_main_recent", HomeMainRecent);
Index.component("home_main_more", HomeMainMore);
Index.component("home_misc", HomeMisc);
Index.component("home_footer", HomeFooter);
Index.component("not_found", NotFound);


Index.use(store);
Index.use(Router);

Index.mount("#app");