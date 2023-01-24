function Simon() {   
   this.coloresBase = ["VERDE", "ROJO", "AMARILLO", "AZUL"];
   this.colorJugador = -1;
   this.pulsaCol = this.pulsarColor.bind(this); // Para poder usar funciones con BIND/anonimas... almacenar función en variable para guardar la referencia   
   this.pulsacion = 0;
   this.pulsado = false;
   this.parado = true;
}

/**
 * Cambia estado de pulsadores activando o desactivando sus eventos
 * @param {Boolean} activo Array con colores a mostrar
 */
Simon.prototype.activarColoresUsuario = function (activo) {
   if (activo) {
      for (let i=0, total = this.coloresBase.length; i < total; i=i+1) {
         document.getElementById("color_" + i).addEventListener("click", this.pulsaCol);
         document.getElementById("color_" + i).classList.add("color_"+ i +"_over");
      }
      document.getElementById("simon").classList.remove("punteroProhibido");
      document.getElementById("simon").classList.add("punteroMano");
   } else {
      for (let i=0, total = this.coloresBase.length; i < total; i=i+1) {
         document.getElementById("color_" + i).removeEventListener("click", this.pulsaCol);
         document.getElementById("color_" + i).classList.remove("color_"+ i +"_over");
      }
      document.getElementById("simon").classList.remove("punteroMano");
      document.getElementById("simon").classList.add("punteroProhibido");
   }
}

/**
 * Muestra colores al usuario
 * @param {Array} p_secuencia Array con colores a mostrar
 * @param {Number} p_retardo Entero con tiempo en milisegundos entre color y color
 */
Simon.prototype.mostrarSecuencia = async function (p_secuencia, p_retardo) {
   let color = "";
   let longitud = p_secuencia.length;
   let retardo = p_retardo; // milisegundos
   let i = 0;
   console.log(p_secuencia);
   document.getElementById("tiempoTurno").innerHTML = "...";
   document.getElementById("colorTurno").innerHTML = "MEMORIZA";
   while ((i < longitud) && (!this.parado)) {
      color = document.getElementById("color_"+(p_secuencia[i])).style;
      color.opacity = "0.25";
      await sleep(retardo);
      color.opacity = "";
      await sleep(retardo);
      i++;
   }
   if (!this.parado) {
      document.getElementById("colorTurno").innerHTML = "...";
   }
}

/**
 * Muestra color pulsado obteniendo la referencia del color desde el propio pulsador
 */
Simon.prototype.pulsarColor = function () {
   // this apunta al objeto, no al elemento que dispara el evento. event apunta al elemento que lanza el evento y target nos dirá que botón es
   obj = (event.target); 
   this.colorJugador = obj.id.substr(6,1);   
   this.pulsacion++;
   this.pulsado = true;
   document.getElementById("colorTurno").innerHTML = this.pulsacion + " · " + this.coloresBase[this.colorJugador];
}

/**
 * Rutina principal del juego
 */
Simon.prototype.jugar = async function () {
   let secuencia = [];
   let longitudSecuencia = 0;
   let correcto = true;
   let puntos = 0;
   let tiempo = 0;
   let tiempoPulsacion = 30; // tiempo en decimas de segundo disponible para pulsar cada color
   this.parado = false;
   
   document.getElementById("simon").style.filter="blur(0)";
   document.getElementById("puntuacion").innerHTML = puntos;

   while (correcto && (!this.parado)) {
      colorActual = generarAleatorio (0, this.coloresBase.length-1);
      secuencia.push(colorActual);
      longitudSecuencia = longitudSecuencia + 1; // = secuencia.length . Más rápido sumar uno cada vez que medir el array cada vez
      color = 0;
      this.colorJugador = -1;
      posicion = 0;
      this.pulsacion = 0;
      this.pulsado = false;

      await this.activarColoresUsuario(false);
      await sleep(1000); // Espera para dar tiempo al usuario a fijar en la nueva secuencia tras introducir su secuencia manual      
      await this.mostrarSecuencia(secuencia, 1000);
      await this.activarColoresUsuario(true);
      
      /**
       * Debido a la naturaleza asincrona de los eventos y del efecto sobre la variable parado,
       * se realizan comprobaciones en cada punto donde se pretenda evitar entrar en tareas, bucles, etc
       * según el estado de la variable que podría cambiar durante la ejecución de dicho punto a detener
       */
      
      tiempo = longitudSecuencia * tiempoPulsacion;
      // Controlando una secuencia de pulsaciones
      while ((this.pulsacion < longitudSecuencia) && (correcto) && (!this.parado)) {
         // Controlando una pulsacion
         while ((tiempo > 0 ) && (!this.pulsado) && (!this.parado)) {
            tiempo = tiempo - 1;
            document.getElementById("tiempoTurno").innerHTML = tiempo;
            await sleep(100);
         }
         this.pulsado = false;
         correcto = (this.colorJugador == secuencia[this.pulsacion-1]);
      }
      // Comprobamos si se ha salido únicamente por estado de parado
      if (correcto && (this.pulsacion == longitudSecuencia)) {
         puntos = puntos + 1;
         document.getElementById("puntuacion").innerHTML = puntos;
      }      
      
      
   }
   await this.activarColoresUsuario(false);
   this.finPartida();
   console.log("Fin partida");
}

/**
 * Detiene la partida en curso.
 * Se plantea como una función separada de finPartida para dar la posibilidad 
 * en un futuro de transformar la funcionalidad a una pausa durante la partida 
 * sin finalización
 */
Simon.prototype.parar = function () {
   this.parado = true;
   this.finPartida();
}

/**
 * Finaliza la partida en curso.
 * El objetivo de esta función no es de de definir una pausa sino de dar por
 * finalizada la partida
 */
Simon.prototype.finPartida = function() {
   this.parado = true;
   document.getElementById("btnOnOff").innerHTML = "INICIAR";
   document.getElementById("btnOnOff").style.backgroundColor = "";
   document.getElementById("tiempoTurno").innerHTML = "0";
   // No se trata de reiniciar contadores. Se trata de finalizar partida. Se mantiene última puntuación obtenida
   // document.getElementById("puntuacion").innerHTML = "0";
   document.getElementById("simon").style.filter ="blur(15px)";
   document.getElementById("colorTurno").innerHTML = "FIN PARTIDA";
}