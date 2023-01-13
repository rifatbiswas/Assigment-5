
const app = require("./app");

const PORT = process.env.PORT || 5050;

app.listen(PORT, ()=>{
    console.log(`server is counected at http://localhost:${PORT}`);
});