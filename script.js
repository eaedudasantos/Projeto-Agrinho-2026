function trocarImagem(){

let c=document.getElementById("cultura").value;
let img=document.getElementById("imgCultura");

/* 🌱 SOJA (campo uniforme profissional) */
if(c=="soja"){
img.src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449";
}

/* 🌽 MILHO (plantação madura em linhas) */
else if(c=="milho"){
img.src="https://images.unsplash.com/photo-1602526210570-8f3c4f1a6e2b";
}

/* ☕ CAFÉ (plantação real em montanha, linhas organizadas) */
else if(c=="cafe"){
img.src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd";
}

/* 🌾 TRIGO (campo dourado profissional) */
else if(c=="trigo"){
img.src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6";
}

/* 🌿 ALGODÃO (campo branco em produção) */
else if(c=="algodao"){
img.src="https://images.unsplash.com/photo-1595433562696-a9b41c82b0c5";
}

}