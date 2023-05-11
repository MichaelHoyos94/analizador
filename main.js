const Tokens = {
    NO_RECONOCIDO: `desconocido`,
    ENTERO: `Numero entero`,
    DECIMAL: `Numero decimal`,
    IDENTIFICADOR: `Identificador`,
    PALABRA_RESERVADA: `Palabra reservada`,
    CADENA_CARACTERES: `String`,
    COMENTARIO_LINEA: `Comentario`,
    COMENTARIO_BLOQUE: `Bloque de comentario`,
    OPERADOR_ARITMETICO: `Operador aritmetico`,
    OPERADOR_RELACIONAL: `Operador relacional`,
    OPERADOR_LOGICO: `Operador logico`,
    OPERADOR_INCREMENTO: `Operador de incremento`,
    ESPACIO_O_SALTO: 'Espacio o salto'
}
/**
 * Representa un token, el analizador tendra una lista de estos.
 */
class Token {
    constructor(tipo, valor, estado, ultimo){
        this.tipo = tipo;
        this.valor = valor,
        this.estado = estado,
        this.ultimo = ultimo
    };
}
/**
 * El analizador, toma el codigo fuente y lo analiza para formar una lista de tokens.
 */
class analizador {
    constructor(codigo, lista_tokens) {
        this.codigo = codigo;
        this.lista_tokens = lista_tokens;
    };
    /**
     * Metodo para analizar el codigo fuente.
     */
    analizar = () => {
        let i = 0;
        let token = null;
        console.log(this.codigo);
        console.log(this.codigo.length);
        while (i < this.codigo.length) {
            token = this.extraerSgteToken(i);
            this.lista_tokens.push(token)
            i = token.ultimo + 1;
        }
        console.log(this.lista_tokens);
    };
    extraerSgteToken = (i) => {

        let token = this.extraerNumero(i);
        if (token) {
          return token;
        }
      
        token = this.extraerString(i);
        if (token) {
          return token;
        }
      
        token = this.extraerIdentificador(i);
        if (token) {
          return token;
        }

        token = this.quitarEspacio(i);
        if (token) {
            return token;
        }
      
        return new Token(Tokens.NO_RECONOCIDO, this.codigo.charAt(i), 'ERROR', i);
      };


    quitarEspacio(i){

        let caracter = this.codigo.charAt(i);

        if (caracter === ' ' || caracter === '\n') {
            return new Token(Tokens.ESPACIO_O_SALTO, this.codigo.charAt(i), 'SALTO O ESPACIO', i);
        }

        return null;

    }

    extraerNumero(i) {
        //Posicion Actual de la cadena
        let caracter = this.codigo.charAt(i);

        //Si posicion actual de la cadena es un numero
        if (!isNaN(caracter)) {
            let pos = i;
            i++;   

            //Siga recorriendo mientras encuentre un numero o un punto
            while (i < this.codigo.length && (!isNaN(caracter) || caracter === '.')) { 
                i++;           
                caracter = this.codigo.charAt(i);
                
                
            }

              
            //Evaluo si la subcadena es un numero entero
            if (Number.isInteger(Number(this.codigo.substring(pos, i)))) {
                return new Token(Tokens.ENTERO, this.codigo.substring(pos, i), `OK`, i);
            
            //Evaluo si la subcadena es un numero decimal
            } else if (Number.isFinite(Number(this.codigo.substring(pos, i)))) {
                return new Token(Tokens.DECIMAL, this.codigo.substring(pos, i), `OK`, i);

            } else {
                return null;
            }

        }

        return null;

    };

    extraerIdentificador(i) {
        //Valor con el que deben hacer match solo acepta si esta en mayuscula, empieza con $ y no termina con -
        const pattern = /^\$[A-Z]+(-[A-Z]+)*$/;
        //match si puso el identificador en minuscula
        const patternError = /^\$[A-Z]+(-[A-Z]+)*$/i;
        //martc para saber si es una letra
        const patternLetra = /^[a-zA-Z]/;
        let caracter = this.codigo.charAt(i);
      
        if (caracter == "$") {
          let pos = i;
          i++;
          caracter = this.codigo.charAt(i);
          
          
          //mientras sea una letra o un -
          while (i < this.codigo.length && (patternLetra.test(caracter) || caracter === "-")) {
            i++;
            caracter = this.codigo.charAt(i);
            
            
            
          }
          //si hace match retorne el token tipo identificador
          if (pattern.test(this.codigo.substring(pos, i))) {
            console.log("Se extrajo un identificador.");
            return new Token(Tokens.IDENTIFICADOR, this.codigo.substring(pos, i), "OK", i);
          } else if (caracter === "-") { // sino retorne un tipo token no reconocido con un error
            return new Token(Tokens.NO_RECONOCIDO, this.codigo.substring(pos, i), "ERROR-IDENTIFICADOR SIN CERRAR", i);
          }else if(patternError.test(this.codigo.substring(pos, i))){ // sino retorne un tipo token no reconocido con un error
            return new Token(Tokens.NO_RECONOCIDO, this.codigo.substring(pos, i), "ERROR-IDENTIFICADOR EN MINUSCULAS", i);
          }
        }
        return null;
    };
      
    extraerString(i) {

         //Valor con el que deben hacer match solo acepta si empieza y termina con /
        const pattern = /^\/.*\/$/;
        let caracter = this.codigo.charAt(i);
    
        if (caracter === '/') {
            let pos = i;
            i++;
    
            //mientras el caracter sea diferente a un salto de linea
            while (i < this.codigo.length && caracter !== '\n') {
                i++;
                caracter = this.codigo.charAt(i);
                
                //Si encuientra otro / termine el ciclo que hemos terminado de encontrar nuestra cadena
                if (caracter === '/') {
                    i++;
                    caracter = this.codigo.charAt(i);
                    
                    
                    break;
                }
                
                
               
                
            }

    
            
            //Si la cadena hace martch con el pattern retorne el token tipo cadena de caracteres
            if (pattern.test(this.codigo.substring(pos, i))) {
                return new Token(Tokens.CADENA_CARACTERES, this.codigo.substring(pos, i), `OK`, i);
            }
        }
    
        return null;
    };
    
    
}
const a = new analizador("$id @@@ /Una cadena@@@ſ€ſđſ@ŋđ/123.4!COMMENTARIO!", []);
a.analizar();
