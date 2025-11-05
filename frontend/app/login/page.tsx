'use client';
import React from "react";
import { useRouter } from "next/navigation";

const URL = "https://fallible-tenthly-memphis.ngrok-free.dev/api/login";

async function mandarAapi(mail:String, password:String, router: any) {
    try {
        const data = {
            email: mail,
            password: password
        };

        // Enviar con fetch a la API
        console.log(JSON.stringify(data));
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        // Si la respuesta no es ok
        if (!response.ok) {
            router.push("/error");
            return;
        }

        // Intentar obtener el JSON de la respuesta
        const result = await response.json();
        console.log("Respuesta de la API:", result);

        // Verificar si la respuesta fue exitosa
        if (result && result.success) {
          // !!! aqui se tiene que poner los case para cada tipo de usuario!!! 
            router.push("/dashboard");
        } else {
            router.push("/error");
        }
    } catch (error) {
        // Captura cualquier error 
        router.push("/error");
    }
}

function Guardar(router: any) {
    const mail = document.getElementById("mail") as HTMLInputElement | null;
    let mailv = "";
    if (mail) {
        mailv = mail.value;
        console.log(mailv);
    }

    const contrasena = document.getElementById("contr") as HTMLInputElement | null;
    let contrasenav = "";
    if (contrasena) {
        contrasenav = contrasena.value;
        console.log(contrasenav);
    }

    //mandar a api
    mandarAapi(mailv, contrasenav, router);
}

const Home = () => {
    const router = useRouter();

    return (
       
    <div className="flex flex-col items-center rounded-2xl min-w-100 border-2 cristal">

   
        <div className="flex mt-10">
            <h1 className="text-white font-bold text-4xl">Login</h1>
        </div>

        <form onSubmit={(e) => {
            e.preventDefault();
            Guardar(router);
        }} className="flex flex-col justify-center items-center">
            <input type="text" name="" id="mail" placeholder="Email" className="p-2 mb-5 mt-20 border-2 border-gray-500  rounded-4xl text-white min-w-80" />
            <input type="password" name="" id="contr" placeholder="Contrasena" className="p-2 border-2 border-gray-500 rounded-4xl text-white min-w-80" />
            <input type="submit" value="Entrar" className="p-1 mt-5 mb-3 border-2 border-gray-700 rounded-4xl text-white font-bold min-w-40 transition-all duration-550 hover:scale-105 hover:rotate-360"></input>
        </form>
    </div>
       
    );
};

export default Home;