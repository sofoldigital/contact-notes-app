const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: "Home",
        path: "/contacts",
        component: () => import("pages/Index.vue"),
        meta: {
          requiresAuth: true,
          title: "Contacts",
        },
      },
      {
        name: "Add Contact",
        path: "/contacts/create",
        component: () => import("pages/CreateContact.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "Edit Contact",
        path: "/contacts/edit/:id",
        component: () => import("pages/EditContact.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "Add Interaction",
        path: "/interactions/add/:id",
        component: () => import("pages/AddInteraction.vue"),
        meta: {
          requiresAuth: true,
          title: "Add Interaction",
        },
      },
      {
        name: "Edit Interaction",
        path: "/interactions/edit/:id",
        component: () => import("pages/EditInteraction.vue"),
        meta: {
          requiresAuth: true,
          title: "Edit Interaction",
        },
      },
      {
        name: "Profile",
        path: "/profile",
        component: () => import("pages/Profile.vue"),
        meta: {
          requiresAuth: true,
          title: "Profile",
        },
      },
      {
        name: "Management",
        path: "/management",
        component: () => import("src/pages/Admin.vue"),
        meta: {
          requiresAuth: true,
          title: "User Management",
        },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        name: "Login",
        path: "",
        component: () => import("pages/Login.vue"),
        meta: {
          title: "Login",
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
