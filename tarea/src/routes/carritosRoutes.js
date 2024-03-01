import { Router } from "express";
import fs from "fs"


const carritoRouter = Router()


const PATH = "src/data/carrito.json"
const PATHProductos = "src/data/productos.json"



carritoRouter.get("/", async(req,res) => {

    const carritos = await fs.promises.readFile(PATH, "utf-8");
    const parseados = JSON.parse(carritos)
    res.send(parseados)
})

carritoRouter.post("/agregar/carrito", async(req,res) => {

    const body = req.body

    const carritos = await fs.promises.readFile(PATH, "utf-8");
    const parseados = JSON.parse(carritos)

    const Productos = await fs.promises.readFile(PATHProductos, "utf-8");
    const Parseado = JSON.parse(Productos);

    const filtrar = Parseado.find(element => element.id == req.body.id)

    if(filtrar){
        let info = {
            id: parseados.length + 1,
            products: [body]
        }
    
        parseados.push(info)
        await fs.promises.writeFile(PATH, JSON.stringify(parseados, null, "\t"));
    
        res.send({status:"Agregado al carrito"})
    }else{
        res.send({status:"No se encontro ningun producto"})
    }

})


carritoRouter.get("/verProductosCarritos/:id", async(req,res) => {

    const params = req.params.id

    const carritos = await fs.promises.readFile(PATH, "utf-8");
    const parseados = JSON.parse(carritos)

    const filter = parseados.find(element => element.id == params)

    res.send(filter)
})

carritoRouter.post("/:cid/product/:id", async(req,res) => {

    const paramsCarrito = req.params.cid

    const paramsProducto = req.params.id


    const carritos = await fs.promises.readFile(PATH, "utf-8");
    const Productos = await fs.promises.readFile(PATHProductos, "utf-8");

    const parseados = JSON.parse(carritos)
    const Parseado = JSON.parse(Productos);


    const findIndex = parseados.findIndex(element => element.id == paramsCarrito)
    if(findIndex !== -1){
        const findProduct = Parseado.findIndex(element => element.id == paramsProducto)
        console.log(findProduct, paramsProducto)
        if(findProduct !== -1){
            const carritoEncontrado = parseados[findIndex];
            const productoEncontrado = carritoEncontrado.products.find(product => product.id == paramsProducto);
            if (productoEncontrado) {
                productoEncontrado.cantidad = parseInt(productoEncontrado.cantidad ) + 1;
            } else {
                carritoEncontrado.products.push({ id: paramsProducto, cantidad: 1 });
            }
        }
    }

    await fs.promises.writeFile(PATH, JSON.stringify(parseados, null ,"\t"))

    res.send({status:"Encontrado"})

})
export default carritoRouter