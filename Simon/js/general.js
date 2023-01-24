/**
 * Genera tiempo de esperas.
 * Devuelve "promesa" para ser utilizada con await y forzar funcionamientos sincronos deteniendo el script
 * @param {Number} ms Tiempo de espera en milisegundos
 */
function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Genera un valor aleatorio entre dos valores ambos incluidos
 * @param {Number} min Rango mínimo
 * @param {Number} max Rango máximo
 */
function generarAleatorio(min, max) {
   return parseInt(Math.random() * (max - min + 1) + min, 10);
}

/** ************************************************************************ */

window.onload = async function() {

   /**
    * Callback que responde al botón y inicia o detiene la partida
    */
   function ev_btnOnOff() {
      let btn = event.target;
      if (btn.innerHTML =="INICIAR") {
         this.jugar();
         btn.innerHTML = "DETENER";
         btn.style.backgroundColor = "red";
         document.getElementById("colorTurno").innerHTML = "&nbsp;";
      } else {
         this.parar();
         btn.innerHTML = "INICIAR";
         btn.style.backgroundColor = "";
      }
   }

   let simon = new Simon();
   document.getElementById("btnOnOff").addEventListener("click", ev_btnOnOff.bind(simon));

}