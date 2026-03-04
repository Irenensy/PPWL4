import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .post("/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )

   app.get(
    "/user/:id",
    ({ params }) => {
      return {
        userId: params.id
      }
    },
    {
      params: t.Object({
        id: t.String()
      })
    }
  )

   app.get(
    "/search",
    ({ query }) => query,
    {
      query: t.Object({
        keyword: t.String(),
        page: t.Optional(t.Number())
      })
    }
  )

  app.get("/products/:id"
    , (context) =>{context.params , context.query},
    {
      params: t.Object({
        id: t.Number()
      }),
      query: t.Object({
        sort: t.String({ enum: ["asc", "desc"]})
      })
    }
  )
  app.get(
    "/ping",
    () => {
      return {
        success: true,
        message: "Server OK"
      }
    },
    {
      response: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    }
  )

  app.get(
  "/stats",
  () => {
    return {
      total: 10,
      active: 5
    };
  },
  {
    response: t.Object({
      total: t.Number(),
      active: t.Number()
    })
  }
)

app.get(
  "/product",
  () => ({
    id: 1,
    name: "Laptop"
  }),
  {
    afterHandle({ response }) {
      return {
        success: true,
        Message: "data tersedia",
        data: response
      }
    }
  }
)
.listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
