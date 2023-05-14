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
    OPERADOR_ASIGNACION: `Operador de asignacion`,
    FIN_SENTENCIA: `Fin de sentencia`,
    APERTURA: 'Parentesis o llave de apertura',
    CIERRE: `Parentesis o llave de cierre`,
    SEPARADOR: `Separador`,
    HEXADECIMAL: `Hexadecimal`
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
        while (i < this.codigo.length) {
            if (this.codigo.charAt(i) != ` ` && this.codigo.charAt(i) != `\n`) {
                token = this.extraerSgteToken(i);
                this.lista_tokens.push(token)
                i = token.ultimo + 1;
            } else {
                i++;
            }
        }
        console.log(this.lista_tokens);
        return this.lista_tokens;
    };
    /**
     * @author Michael Aguirre
     * @description Extrae el token desde la posicion i, llama cada uno de los metodos para verificar el tipo de token.
     * @param {*} i 
     * @returns 
     */
    extraerSgteToken = (i) => {

        let token = this.extraerNumero(i);
        if (token)
            return token;

        token = this.extraerString(i);
        if (token) 
            return token;

        token = this.extraerAumDec(i);
        if (token)
            return token;

        token = this.extraerOperadoresRelacionales(i);
        if (token)
            return token;

        token = this.extraerOperAr(i);
        if (token)
            return token;

        token = this.extraerComentario(i);
        if (token) 
            return token;

        token = this.extraerIdentificador(i);
        if (token) 
            return token;

        token = this.extraerAsignacion(i);
        if (token)
            return token;
        
        token = this.extraerLogico(i);
        if (token)
            return token;

        token = this.extraerAperturaCierre(i);
        if (token)
            return token;
        
        token = this.extraerFin(i);
        if (token)
            return token;

        token = this.extraerSeparador(i);
        if (token)
            return token;

        token = this.extraerPalabraReservada(i);
        if (token)
            return token;

        token = this.extraerHexadecimal(i);
        if (token)
            return token;

        
        return new Token(Tokens.NO_RECONOCIDO, this.codigo.charAt(i), 'ERROR', i);
    }
    extraerString = (i) => {///an
        if (this.codigo.charAt(i) == `/`) {
            let pos = i;
            i++;
            while (i < this.codigo.length && this.codigo.charAt(i) !== `\n`) {
                if (this.codigo.charAt(i) === `/`)
                    return new Token(Tokens.CADENA_CARACTERES, this.codigo.substring(pos, i + 1), `OK`, i);
                i++;
            }
            return new Token(Tokens.NO_RECONOCIDO, this.codigo.substring(pos, i), `CADENA SIN CERRAR`, i);
        }
        return null;
    };
    extraerComentario = (i) => {//!
        if (this.codigo.charAt(i) == `!`) {
            let pos = i;
            i++;
            while (i < this.codigo.length && this.codigo.charAt(i) !== `\n`) {
                if (this.codigo.charAt(i) === `!`)
                    return new Token(Tokens.COMENTARIO_LINEA, this.codigo.substring(pos, i + 1), `OK`, i );
                i++;
            }
            return new Token(Tokens.NO_RECONOCIDO, this.codigo.substring(pos, i), `ERROR`, i);
        }
        return null;
    };
    extraerAsignacion = (i) => {
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

    extraerPalabraReservada = (i) => {
        var palabrasReservadas = ["ENTERO", "REAL", "PARA", "MIENTRAS", "PRIVADO", "PUBLICO", "PAQUETE", "IMPORTAR", "CLASE", "RETORNAR", "BREAK", "CADENA", "BOOLEANO", "SI", "CASO"];
        var patternLetra = /^[a-zA-Z]/;
        var caracter = this.codigo.charAt(i);
      
        if (patternLetra.test(caracter)) {
          var pos = i;
          i++;
          caracter = this.codigo.charAt(i);
      
          while (i < this.codigo.length && patternLetra.test(caracter) && caracter !== " ") {
            i++;
            caracter = this.codigo.charAt(i);
          }
      
          var palabra = this.codigo.substring(pos, i);
      
          if (palabrasReservadas.includes(palabra.toUpperCase())) {
            if (palabra === palabra.toUpperCase()) {
              return new Token(Tokens.PALABRA_RESERVADA, this.codigo.substring(pos, i), "OK", i);
            } else {
                return new Token(Tokens.NO_RECONOCIDO, this.codigo.substring(pos, i), "ERROR-PALABRA REERVADA EN MINISCULA", i);
            }
          }
        }
      
        return null;
      }

      extraerHexadecimal = (i) =>{

        var patternHexadecimal = /^[0-9A-Fa-f]+$/;
        var caracter = this.codigo.charAt(i);

        if (caracter === '#' && patternHexadecimal.test(this.codigo.charAt(i+1))) {

            var pos = i;
            i++;
            caracter = this.codigo.charAt(i);

            while (i < this.codigo.length && patternHexadecimal.test(caracter)) {
                i++;  
                caracter = this.codigo.charAt(i);  
            }

            return new Token(Tokens.HEXADECIMAL, this.codigo.substring(pos, i), "OK", i);
            
        }

        return null;

      }

      extraerOperadoresRelacionales = (i) =>{
        var baseOperadores = ["=", "<", ">", "!"];
        var operadoresRelacionales = ["==", "!=", "<", ">", "<=", ">="];
        var caracter = this.codigo.charAt(i);


        if (baseOperadores.includes(caracter.toString())) {
            var pos = i;
            //i++;
            //caracter = this.cadena.charAt(i);

            if (baseOperadores.includes(this.codigo.charAt(i+1))) { 
                i++;
            }

            var operador = this.codigo.substring(pos, i);

            if (operadoresRelacionales.includes(operador)) {
                return new Token(Tokens.OPERADOR_RELACIONAL, this.codigo.substring(pos, i), "OK", i);
            }
            
        }

        return null;
      }
      
      
    /*
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
    };*/
    extraerNumero = (i) => {
        //Posicion Actual de la cadena
        let caracter = this.codigo.charAt(i);
        //Si posicion actual de la cadena es un numero
        if (!isNaN(caracter)) {
            let pos = i;
            i++;
            caracter = this.codigo.charAt(i);

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
    extraerAperturaCierre = (i) =>{
        let char = this.codigo.charAt(i);
        if (char === `(` || char === `[`)
            return new Token(Tokens.APERTURA, char, 'OK', i);
        else if (char === `)` || char === `]`)
            return new Token(Tokens.CIERRE, char, `OK`, i);
        return null;
    };
    extraerSeparador = (i) =>{
        let char = this.codigo.charAt(i)
        if (char === `,`)
            return new Token(Tokens.SEPARADOR, char, `OK`, i);
        return null;
    };
    extraerAumDec = (i) =>{ 
        if (this.codigo.charAt(i) === `+` && this.codigo.charAt(i + 1) === `+`)
            return new Token(Tokens.OPERADOR_INCREMENTO, this.codigo.substring(i, i + 2), `OK`, i + 1);
        if (this.codigo.charAt(i) === `-` && this.codigo.charAt(i + 1) === `-`)
            return new Token(Tokens.OPERADOR_INCREMENTO, this.codigo.substring(i, i + 2), `OK`, i + 1);
        return null;
    };
    extraerOperAr = (i) =>{
        let char = this.codigo.charAt(i);
        if (char === `+` || char === `-` || char === `*`)
            return new Token(Tokens.OPERADOR_ARITMETICO, char, `OK`, i)
        return null;
    };
}

const codigo = document.getElementById(`txt-codigo`);
const btn = document.getElementById("btn_analizar");
const res = document.getElementById("res-list");
    
btn.addEventListener('click', function() {
    const codigoFuente = codigo.value;
    const a = new analizador(codigoFuente, []);
    const tokens_analizados = a.analizar();
    let elementos = ``;
    tokens_analizados.forEach(element => {
        if(element.estado === `OK`)
            elementos += `<li class="list-group-item list-group-item-success">Tipo: ${element.tipo} | Valor: ${element.valor} | Estado: ${element.estado}</li>\n`
        else
            elementos += ` <li class="list-group-item list-group-item-danger">Tipo: ${element.tipo} | Valor: ${element.valor} | Estado: ${element.estado}</li>\n`
    });
    res.innerHTML = elementos;
});

/*
const codigo1 = "$ID =>2 @@@++*-+ ,,[[[(/CADENA/!COMEN!YONFIN)";
const a = new analizador(codigo1, []);
a.analizar();*/