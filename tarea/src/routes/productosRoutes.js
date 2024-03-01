import { Router } from "express";
import fs from "fs"
import __dirname from "../util.js";
import { upload } from "./multer.js";
const productosRouter = Router()
const PATHProductos = "src/data/productos.json"




productosRouter.get("/limit/:numero", async (req, res) => {

    const params = req.params.numero

    const traerProductos = await fs.promises.readFile(PATHProductos, "utf-8")

    const parseados = JSON.parse(traerProductos)

    let productosLimitados = []

    for (let i = 0; parseados.length > i && params > i; i++) {

        productosLimitados.push(parseados[i])

    }

    res.send(productosLimitados)

})


productosRouter.get("/buscar/:id", async (req, res) => {

    const params = req.params.id

    const traerProductos = await fs.promises.readFile(PATHProductos, "utf-8")

    const parseados = JSON.parse(traerProductos)

    const filtrados = parseados.find(element => element.id == params)


    res.send(filtrados)

})




productosRouter.post("/agregar/productos", upload.single("image"), async (req, res) => {

    const body = req.body

    const traerProductos = await fs.promises.readFile(PATHProductos, "utf-8")

    const parseados = JSON.parse(traerProductos)



    let resultado = '';
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = "1234567890"
    for (let i = 0; i < 2; i++) {
        resultado += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    for (let i = 0; i < 3; i++) {
        resultado += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }


    let newProduct = {
        title: body.title,
        description: body.description,
        code: resultado,
        price: body.price,
        stock: body.stock,
        category: body.category,
        img: req.file.filename, 
        id: parseados.length + 1
    }

    parseados.push(newProduct)

    await fs.promises.writeFile(PATHProductos, JSON.stringify(parseados, null, "\t"))

    res.send({ status: "enviado" })
})


productosRouter.get("/actualizar/:id", async (req, res) => {

    const params = parseInt(req.params.id)

    const body = req.body

    const Productos = await fs.promises.readFile(PATHProductos, "utf-8");
    const Parseado = JSON.parse(Productos);
    const encontradoIndex = Parseado.findIndex(element => element.id === params);

    if (encontradoIndex !== -1) {
        body.id = parseInt(params);

        Parseado[encontradoIndex] = {
            ...Parseado[encontradoIndex],
            ...body
        };

        await fs.promises.writeFile(PATHProductos, JSON.stringify(Parseado, null, "\t"));

        res.send({ status: "Encontrado" });
    }

})


productosRouter.delete("/delete/product/:id", async (req, res) => {
    const params = parseInt(req.params.id)

    const Productos = await fs.promises.readFile(PATHProductos, "utf-8");
    const Parseado = JSON.parse(Productos);

    const encontradoIndex = Parseado.filter(element => element.id !== params);


    await fs.promises.writeFile(PATHProductos, JSON.stringify(encontradoIndex, null, "\t"));
    res.send({status:"eliminado con exito"})
})


export default productosRouter