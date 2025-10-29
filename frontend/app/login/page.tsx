'use client';
import React from "react";

const URL = "https://fallible-tenthly-memphis.ngrok-free.dev/api/login";

function mandarAapi(mail:String ,password:String) {

    const data = {
    email: mail,
    password: password
    };

// Enviar con fetch a la API
console.log(JSON.stringify(data));
fetch(URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data), // Transformamos el objeto a JSON
})

  .then((response) => response.json())
  .then((result) => {
    console.log("Respuesta de la API:", result);
  })
  .catch((error) => {
    console.error("Error enviando datos:", error);
  });
    
}

function Guardar() {
    const mail = document.getElementById("mail") as HTMLInputElement | null;;
    let mailv = "";
    if (mail) {
        const value = mail.value;
        mailv = mail.value;
        console.log(value);
    }

    const contrasena = document.getElementById("contr") as HTMLInputElement | null;;
    let contrasenav = "";
    if (contrasena) {
        const value = contrasena.value;
        contrasenav = contrasena.value;
        console.log(value);
    }


    //mandar a api
    mandarAapi(mailv,contrasenav);

}

const Home = () => {
    return (
       
    <div className="flex flex-col items-center rounded-2xl min-w-100 border-2 cristal">

   
        <div className="flex mt-10">
            <h1 className="text-white font-bold text-4xl">Login</h1>
        </div>

        <form action={Guardar} className="flex flex-col justify-center items-center">
            <input type="text" name="" id="mail" placeholder="Email" className="p-2 mb-5 mt-20 border-2 border-gray-500  rounded-4xl text-white min-w-80" />
            <input type="password" name="" id="contr" placeholder="Contrasena" className="p-2 border-2 border-gray-500 rounded-4xl text-white min-w-80" />
            <input type="submit" value="Entrar" className="p-1 mt-5 mb-3 border-2 border-gray-700 rounded-4xl text-white font-bold min-w-40 transition-all duration-550 hover:scale-105 hover:rotate-360"></input>
        </form>

    </div>
       
    );
};

export default Home;