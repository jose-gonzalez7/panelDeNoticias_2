'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const redireccion = useRouter();
  redireccion.push("/login")
  
  return (
    <></>
  );
}