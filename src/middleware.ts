import { Elysia, t } from "elysia"
import { openapi } from "@elysiajs/openapi";


const app = new Elysia()
.use(openapi())
// Global Logger
app.onRequest(({ request }) => {
 console.log("📥", request.method, request.url)
 console.log("🕒", new Date().toISOString())
})


app.get("/", () => "Hello Middleware")

app.get(
 "/dashboard",
 () => ({
   message: "Welcome to Dashboard"
 }),
 {
   beforeHandle({ headers, set }) {
     if (!headers.authorization) {
       set.status = 401
       return {
         success: false,
         message: "Unauthorized"
       }
     }
   }
 }
)
app.get(
 "/admin",
 () => ({
   message: "Welcome to Dashboard"
 }),
 {
   beforeHandle({ headers, set }) {
     if (headers.authorization !== "Bearer 123") {
       set.status = 401
       return {
         success: false,
         message: "Unauthorized"
       }
     }
   }
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

app.post(
  "/login",
  ({ body }) => {
    return {
      message: "Login Berhasil"
    }
  },
  {
    body: t.Object ({
      email: t.String ({ format: "email" }),
      password: t.String ({ minLegth: 8 })
    })
  }
)
app.onError(({ code, error, set }) => {




 if (code === "VALIDATION") {
   set.status = 400
   return {
     success: false,
     message: "Validation Error",
     detail: error.message
   }
 }


 if (code === "NOT_FOUND") {
   set.status = 404
   return {
     message: "Route not found"
   }
 }


 set.status = 500
 return {
   message: "Internal Server Error"
 }
})



app.listen(3000)
console.log("Server running at http://localhost:3000")