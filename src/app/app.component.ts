import { Component, OnInit } from '@angular/core';
import { ArchivoService } from './archivo.service'; //Importa el servicio que trae el archivo
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; //Importa el servicio para crear el archvido de respuesta final

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private arcivho: ArchivoService, private santizer: DomSanitizer) { } //Inicializa la variable que trae el archivo y de la que lo crea
  public map: number[][]; //Inicializa la variable que tendrá la matriz con el mapa
  public globalCounter: number = 0; //Contador global con el numero de movimientos que se han hecho
  public lineCounter: number = 0; //Contador de las lineas del text
  public m: number; //Almacena el numero de las filas de las matriz del mapa 
  public n: number; //Almacena el numero de las columnas de la matriz del mapa
  public robotX: number; //Almacena la posición del robot en el eje x
  public robotY: number; //Almacena la posición del robot en el eje y
  public goalX: number; //Almacena la posición de la meta en el eje x
  public goalY: number; //Almacena la posición de la meta en el eje x
  public orientation: string; //Almacena la orientación con la que inicia el robot
  public numOfSteps: number; //Almacena el numero de pasos para completar el mapa
  public instructions: string[]; //Almacena el arreglo con las instrucciones de movimiento del robot
  public gameState: number = 0; //Almacena el estado del juego con 0 para en ejecución, 1 para perdido y y 2 para ganado
  public fileUrl: SafeResourceUrl; //Almacena la dirección donde se descargará el archivo con la respuesta final del programa

  ngOnInit() { //Se ejecuta cuando el componente es cargado
    this.arcivho.getArchivo().subscribe((data: String) => { //Obtiene la carga del archivo
      let localColumnCounter: number = 0; // Cuentas las columnas de cada linea para llenar el mapa
      let countPositionRobot: number = 0; //Contador para obtener las posiciones de inicio del robot
      let countPositionGoal: number = 0; //Contador para obtener las posiciones de la meta
      let countPositionSteps: number = 0; //Contador para obtener las posiciones los numeros con los pasos para resolver el mapa
      let localArrayInstrucctions: string[] = new Array(); //Arreglo temporal para almacenar las instrucciones del robot
      this.m = parseInt(data[0]); //Se captura las filas del docuemnto
      this.n = parseInt(data[2]); //Se capturan las columnas del documento
      let localMatrizMap: number[][] = new Array(this.m); //Almacena localmente las posciones del mapa
      for (let i = 0; i < this.m; i++) { //Crea el array temporal
        localMatrizMap[i] = new Array(this.n); //Se asigna la multidimencionalidad al array
      }
      for (let i = 0; i < data.length; i++) { //Recorre todo el archivo
        const element = data[i];//Obtiene el el elemento que se encuentra en cada posción del arreglo
        if (this.lineCounter > 0 && this.lineCounter <= this.m) { //Valida que el contador de lineas este en la zona con los caracteres para construir la matriz del mapa
          if (element.charCodeAt(0) == 48 || element.charCodeAt(0) == 49) { //Se valida que los carateres sean solo 0 y 1 para evidatr los espacios y los saltos de linea
            localMatrizMap[this.lineCounter - 1][localColumnCounter] = parseInt(element); //Se llena la matriz temporal con los datos del archivo
            localColumnCounter++; //Se aumenta el contador local de columnas 
          }
          if (localColumnCounter > this.n - 1) { //Se valida si el contador local de columnas sobrepasó el numero de columnas del archivo
            localColumnCounter = 0; //Se reinicia para volver a comenzar el conteo
          }
        }
        if ((element.charCodeAt(0) >= 48 && element.charCodeAt(0) <= 57) || //Se valida que solo capture caracteres de 0 a 9 a travez del código ASCII
          (element.charCodeAt(0) >= 65 && element.charCodeAt(0) <= 90)) { //Se valida que solo capture letras Mayusculas a travez del código ASCII
          switch (this.lineCounter) { //Se valida la linea en la que se encuntra para obtener los demás valores
            case this.m + 1: //Se suma una unidad al tamaño total de las filas para obtener la poscion de inicio del jugador
              if (countPositionRobot != 0) { //Se valida la poción de la linea para asignar el valor correspondiente a cada coordenada
                this.robotX = parseInt(element) - 1; // IMPORTANTE se resta una unidad para coincidir con la grafica de ejemplo, pero se puede cambiar
              } else {
                this.robotY = parseInt(element) - 1; // IMPORTANTE se resta una unidad para coincidir con la grafica de ejemplo, pero se puede cambiar
              }
              countPositionRobot++; //Se aumenta la variable contador
              break;
            case this.m + 2: //Se suman don unidades para obtener la fila con las posiciones de la meta
              if (countPositionGoal != 0) { //Se valida la poción de la linea para asignar el valor correspondiente a cada coordenada
                this.goalX = parseInt(element) - 1; // IMPORTANTE se resta una unidad para coincidir con la grafica de ejemplo, pero se puede cambiar
              } else {
                this.goalY = parseInt(element) - 1; // IMPORTANTE se resta una unidad para coincidir con la grafica de ejemplo, pero se puede cambiar
              }
              countPositionGoal++;
              break;
            case this.m + 3: //Se suman tres unidades para obtener la linea con la orientación inicial del robot
              this.orientation = element;
              break;
            case this.m + 4: //Se suman tres unidades para obtener el numero de pasos para resolver el mapa
              if (countPositionSteps == 0) {
                this.numOfSteps = parseInt(element);
              } else {
                this.numOfSteps = parseInt(`${this.numOfSteps}${element}`); //Concatena dos enteros sin sumarlos
              }
              countPositionSteps++;
              break;
            case this.m + 5: //Se suman cuatro unidades para obtener la linea con la lista de instrucciones para mover el robot
              localArrayInstrucctions.push(element); //Se guardan los elementos del arreglo con el metodo push de los arrays
              break;
          }
        }
        if (element == "\n") this.lineCounter++; //Asigna una unidad al contador de lineas cuando haya un salto de linea
      }
      this.map = localMatrizMap; //Se iguala el mapa local con el global
      this.map[this.robotY][this.robotX] = 2; //Se asigna la posición de inicio del robot
      this.map[this.goalY][this.goalX] = 3; //Se adigna la posición de la meta
      this.instructions = localArrayInstrucctions; // Se iguala el arreglo de instrucciones local con el global
      // Visualización de los datos capturados por la consola del navegador
      /* 
      for (let i = 0; i < this.m; i++) {
        for (let j = 0; j < this.n; j++) {
          console.log("Mapa[" + i + "][" + j + "]" + this.map[i][j]);
        }
        console.log(" ");
      }
      */
      console.log("Robot X:" + this.robotX);
      console.log("Robot Y:" + this.robotY);
      console.log("Orientación:" + this.orientation);
      console.log("Numero de pasos:" + this.numOfSteps);
      console.log("Meta X:" + this.goalX);
      console.log("Meta Y:" + this.goalY);
    });
  }
  /**
   * 
   * @param e Dirección del movimiento D (Derecha), I(Izquierda), o A(Avanzar) junto los putnos cardinales N(Norte), E(Este), O(Oeste) y S(Sur)
   *
   */
  movement(e: string) {
    switch (e) { //Se comprueba la instrccución que se recivió
      case "D":
        this.girar(e);
        break;
      case "I":
        this.girar(e);
        break;
      case "A":
        let previousStepX: number = this.robotX; //Almacena la posición previa en la que se encontraba el robot en el eje x
        let previousStepY: number = this.robotY; //Almacena la posición previa en la que se encontraba el robot en el eje y
        switch (this.orientation) { //Se comprueba cual es la orientación actual del robot
          case "N": //Si la posición actual es norte
            this.robotY -= 1; //Se resta una unidad en la posición del robot en Y para cambiar su posición y hacerlo avanzar hacia arriba
            break;
          case "E":
            this.robotX += 1; //Se suma una unidad en la posición del robot en X para cambiar su posición y hacerlo avanzar a la derecha
            break;
          case "S":
            this.robotY += 1; //Se suma una unidad en la posición del robot en Y para cambiar su posición y hacerlo avanzar hacia abajo
            break;
          case "O":
            this.robotX -= 1; //Se resta una unidad en la posición del robot en X para cambiar su posición y hacerlo avanzar a la izquierda
            break;
        }
        this.map[previousStepY][previousStepX] = 0; //Se actualiza la posición anterior del robot para limpiarla
        this.map[this.robotY][this.robotX] = 2; //Se actualiza la posición del robot con las nuevas coordenadas
        break;
    }
    console.log("Robot X:" + this.robotX);
    console.log("Robot Y:" + this.robotY);
    console.log("Orientación:" + this.orientation);
  }

  /**
   * 
   * @param e Dirección a la cual se quiere orientar el robot D(Derecha) o I(Izquierda)
   */
  girar(e: string) {
    switch (e) {
      case "D": //Se validan las posiciones para reemplazarlas por la siguiente segun el orden de giro y dar la nueva orientación
        if (this.orientation == "N") return this.orientation = "E";
        if (this.orientation == "E") return this.orientation = "S";
        if (this.orientation == "S") return this.orientation = "O";
        if (this.orientation == "O") return this.orientation = "N";
        break;
      case "I":
        if (this.orientation == "N") return this.orientation = "O";
        if (this.orientation == "O") return this.orientation = "S";
        if (this.orientation == "S") return this.orientation = "E";
        if (this.orientation == "E") return this.orientation = "N";
        break;
    }
  }

  /**
   * 
   * @param e Espera un parametro de avance para comprobar si es posible el movimiento o no
   */
  checkGame(e: string) {
    if (this.globalCounter == this.numOfSteps) { //Comprueba si el contador global alcanzó al numero de pasos 
      if (this.map[this.goalY][this.goalX] == this.map[this.robotY][this.robotX]) { //Se comprueba si el robot alcanzó la meta
        this.gameState = 2; //Se cambia el estado del juego a ganado
      } else {
        this.gameState = 1; //Se cambia el estado del juego a perdido
      }
    }
    if (e == "A") {
      let tempMoveX: number = this.robotX; //Variable temporal para almacenar la posición del robot en x
      let tempMoveY: number = this.robotY; //Variable temporal para almacenar la posición del robot en y
      switch (this.orientation) { //Se comprueba cual es la orientación actual del robot
        case "N": //Si la posición actual es norte
          tempMoveY -= 1; //Se resta una unidad en la posición del robot en Y para cambiar su posición y hacerlo avanzar hacia arriba
          break;
        case "E":
          tempMoveX += 1; //Se suma una unidad en la posición del robot en X para cambiar su posición y hacerlo avanzar a la derecha
          break;
        case "S":
          tempMoveY += 1; //Se suma una unidad en la posición del robot en Y para cambiar su posición y hacerlo avanzar hacia abajo
          break;
        case "O":
          tempMoveX -= 1; //Se resta una unidad en la posición del robot en X para cambiar su posición y hacerlo avanzar a la izquierda
          break;
      }
      let checkPositionMap = (y, x) => (this.map.hasOwnProperty(y) && this.map[y].hasOwnProperty(x)); //Comprueba si la posición del mapa existe segun los ejex x y y
      if (checkPositionMap(tempMoveY, tempMoveX)) { //Si la posición del mapa existe
        if (this.map[tempMoveY][tempMoveX] == 1) { //Comprueba si la dirección del movimiento es igual a la casilla de una bomba
          this.gameState = 1; //Se cambia el estado del juego a perdido
        }
      } else {
        this.gameState = 1; //Se cambia el estado del juego a perdido
      }
    }
    if (this.gameState == 2) {
      alert("Gano");
      this.genereteFile(this.gameState); //Se llama la función que genera el archivo con la letra C
    } else if (this.gameState == 1) {
      alert("Perdio");
      this.genereteFile(this.gameState); //Se llama la función que genera el archivo con la letra E
    }
  }

  /**
   * 
   * @param e El parametro que retorna el tipo de archivo que se va a descargar, 1 para C y 2 para E
   */
  genereteFile(e: number) {
    let doc: Blob; //Se inicializa una variable de tipo Blob para generar el archivo
    if(e == 2){ //Se comprueba el estado del juego que llegó
      doc = new Blob(["C"], { type: "application/octet-stream" });
    } else {
      doc = new Blob(["E"], { type: "application/octet-stream" });
    }
    this.fileUrl = this.santizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(doc)); //Se crea la URL con el link para generar el archivo
  }

  execute() { // Ejecuta los pasos que se encuentran en el arreglo de instrucciones
    this.checkGame(this.instructions[this.globalCounter]); //Comprueba el estado del juego
    this.movement(this.instructions[this.globalCounter]); //Pasa cada instrucción a la función de movimiento
    this.globalCounter++; //Incrementa la variable cada que se llama a la función
  }
}
