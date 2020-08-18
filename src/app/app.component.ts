import { Component, OnInit } from '@angular/core';
import { ArchivoService } from './archivo.service'; //Importa el servicio que trae el archivo
import { newArray } from '@angular/compiler/src/util';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private arcivho: ArchivoService) { } //Inicializa la variable que trae el archivo 
  public title: String = 'proyecto-final';
  public map: number[][]; //Inicializa la variable que tendrá la matriz con el mapa
  public lineCounter: number = 0; //Contador de las lineas del text
  public m: number; //Almacena el numero de las filas de las matriz del mapa 
  public n: number; //Almacena el numero de las columnas de la matriz del mapa
  public robotX: number; //Almacena la posción del robot en el eje x
  public robotY: number; //Almacena la psoción del robot en el eje y
  ngOnInit() { //Se ejecuta cuando el componente es cargado
    this.arcivho.getArchivo().subscribe((data: String) => { //Obtiene la carga del archivo
      let localColumnCounter: number = 0; // Cuentas las columnas de cada linea para llenar el mapa
      let countPositionRobot: number = 0; //Conatdor para obtener las posciones de inicio del robot
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
        if (element.charCodeAt(0) >= 48 && element.charCodeAt(0) <= 57) { //Se valida que solo capture caracteres de 0 a 9
          switch (this.lineCounter) { //Se valida la linea en la que se encuntra para obtener los demás valores
            case this.m + 1: //Se suma una unidad al tamañi total de las filas para obtener la poscion de inicio del jugador
              if(countPositionRobot != 0){ //Se valida la poción de la linea para asignar el valor correspondiente a cada coordenada
                this.robotX = parseInt(element);
              } else {
                this.robotY = parseInt(element);
              }
              countPositionRobot++; //Se aumenta la variable contador
              break;
          }
        }
        if (element == "\n") this.lineCounter++; //Asigna una unidad al contador de lineas cuando haya un salto de linea
      }
      this.map = localMatrizMap; //Se iguala el mapa local con el global
      this.map[this.robotX][this.robotY] = 2; //Se asigna la posición de inicio del robot
      for (let i = 0; i < this.m; i++) {
        for (let j = 0; j < this.n; j++) {
          console.log("Mapa[" + i + "][" + j + "]" + this.map[i][j]);
        }
        console.log(" ");
      }
      console.log("Robot X:" + this.robotX);
      console.log("Robot Y:" + this.robotY);
    });
  }
}
