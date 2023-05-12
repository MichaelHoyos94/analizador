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
    ESPACIO_O_SALTO: 'Espacio o salto',
    OPERADOR_ASIGNACION: `Operador de asignacion`,
    FIN_SENTENCIA: `Fin de sentencia`
}
/**
 * Representa un token, el analizador tendra una lista de estos.
 */
class Token {
    constructor(tipo, valor, estado, ultimo) {
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
            if (this.codigo.charAt(i) != ` `) {
                token = this.extraerSgteToken(i);
                this.lista_tokens.push(token)
                i = token.ultimo + 1;
            } else {
                i++;
            }
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
        if(token)
            return token;
        token = this.extraerPalabraReservada(i);

        /*token = this.quitarEspacio(i);
        if (token) {
            return token;
            token = this.extraerAsignacion(i);
            if (token)
                return token;
            token = this.extraerLogico(i);
            if (token)
                return token;
            token = this.extraerFin(i);
            if (token)
                return token;*/
            return new Token(Tokens.NO_RECONOCIDO, this.codigo.charAt(i), 'ERROR', i);
        };


        /*quitarEspacio(i){
    
            let caracter = this.codigo.charAt(i);
    
            if (caracter === ' ' || caracter === '\n') {
                return new Token(Tokens.ESPACIO_O_SALTO, this.codigo.charAt(i), 'SALTO O ESPACIO', i);
            }
    
            return null;
    
        }*/

        extraerNumero = (i) => {
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
        extraerString = (i) => {
            if (this.codigo.charAt(i) == `/`) {
                let pos = i;
                i++;
                while (i < this.codigo.length && this.codigo.charAt(i) != `/`) {
                    i++;
                }
                i++;
                console.log(`Se extrajo un String`);
                return new Token(Tokens.CADENA_CARACTERES, this.codigo.substring(pos, i), `OK`, i - 1);
            }
            return null;
        };
        extraerComentario = (i) => {
            if (this.codigo.charAt(i) == `!`) {
                let pos = i;
                i++;
                while (i < this.codigo.length && this.codigo.charAt(i) != `!`) {
                    i++;
                }
                i++;
                console.log(`Se extrajo un comentario`);
                return new Token(Tokens.COMENTARIO_LINEA, this.codigo.substring(pos, i), `OK`, i - 1);
            }
            return null;
        };
        extraerAsignacion = (i) => {//=> i = 0;
            if (this.codigo.charAt(i) == `=` && this.codigo.charAt(i + 1) == `>`)
                return new Token(Tokens.OPERADOR_ASIGNACION, this.codigo.substring(i, i + 2), `OK`, i + 1);
            return null;
        };
        extraerLogico = (i) => {
            if (this.codigo.charAt(i) == `Y` || this.codigo.charAt(i) == `O` || this.codigo.charAt(i) == `N`)
                return new Token(Tokens.OPERADOR_LOGICO, this.codigo.charAt(i), `OK`, i);
            return null;
        };
        extraerFin = (i) => {
            if (this.codigo.substring(i, this.codigo.length).startsWith(`FIN`))
                return new Token(Tokens.FIN_SENTENCIA, `FIN`, `OK`, i + 2);
            return null;
        };


        extraerIdentificador = (i) => {
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
                } else if (patternError.test(this.codigo.substring(pos, i))) { // sino retorne un tipo token no reconocido con un error
                    return new Token(Tokens.NO_RECONOCIDO, this.codigo.substring(pos, i), "ERROR-IDENTIFICADOR EN MINUSCULAS", i);
                }
            }
            return null;
        };

        extraerString = (i) => {

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

        extraerPalabraReservada = (i) => {
            let codigoMayus = this.codigo.toUpperCase();
            let arr = codigoMayus.split(' ')
            if(arr[i] == `ENTERO` || arr[i] == `REAL` || arr[i] == `PARA` || 
            arr[i] == `MIENTRAS` || arr[i] == `PRIVADO` || arr[i] == `PUBLICO`
            || arr[i] == `PAQUETE` || arr[i] == `IMPORTAR` || arr[i] == `CLASE`
            || arr[i] == `RETORNAR` || arr[i] == `BREAK` || arr[i] == `CADENA`
            || arr[i] == `BOOLEANO` || arr[i] == `SI` || arr[i] == `NO`){
                let pos = i;
                i++;
                while(i < this.codigo.length && (arr[i] != `ENTERO` || arr[i] != `REAL` || arr[i] != `PARA` || 
                arr[i] != `MIENTRAS` || arr[i] != `PRIVADO` || arr[i] != `PUBLICO`
                || arr[i] != `PAQUETE` || arr[i] != `IMPORTAR` || arr[i] != `CLASE`
                || arr[i] != `RETORNAR` || arr[i] != `BREAK` || arr[i] != `CADENA`
                || arr[i] != `BOOLEANO` || arr[i] != `SI` || arr[i] != `NO`)){
                    i++;
                }
                i++;
                console.log(`Se extrajo una palabra Reservada`);
                console.log(codigoMayus);
                return new Token(Tokens.PALABRA_RESERVADA, arr[i], `OK`, i - 1);
            }
        }
    
    }


    

    const codigo1 = "$id =>2 @@@ /CADENA/!COMEN!YONFIN";
    const a = new analizador(codigo1, []);
    a.analizar();
    let cad = `aaa`;
    let ocad = cad.substring(0, 3);
    console.log(ocad);



