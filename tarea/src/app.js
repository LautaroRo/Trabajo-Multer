import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./util.js"
import carritoRouter from "./routes/carritosRoutes.js"
import productosRouter from "./routes/productosRoutes.js"

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use("/api/productos", productosRouter)
app.use("/api/carrito", carritoRouter)

app.set("views", `${__dirname}/views`)

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.listen(8081, () => console.log("Servidor Corriendo"))

app.get("/", (req, res) => {

    res.render("form")

})
