import { Elysia } from "elysia"
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


app.listen(3000)
console.log("Server running at http://localhost:3000")