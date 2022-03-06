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
