const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Home",
        path: "",
        component: () => import("pages/Index.vue"),
        meta: {
          requiresAuth: true,
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
        component: () => import("pages/CreateContact.vue"),
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
        },
      },
      {
        name: "Edit Interaction",
        path: "/interactions/edit/:id",
        component: () => import("pages/EditInteraction.vue"),
        meta: {
          requiresAuth: true,
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
