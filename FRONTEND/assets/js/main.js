const url = "http://localhost:3000/";



fetch(`${url}api/sneakers`)
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.log(error);
});