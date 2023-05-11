const Tokens = {
    NO_RECONOCIDO:`desconocido`,
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
    OPERADOR_INCREMENTO: `Operador de incremento`
}
/**
 * Representa un token, el analizador tendra una lista de estos.
 */
class Token {
    constructor(tipo, valor, estado, siguiente){
        this.tipo = tipo;
        this.valor = valor,
        this.estado = estado,
        this.siguiente = siguiente
    };
}
/**
 * El analizador, toma el codigo fuente y lo analiza para formar una lista de tokens.
 */
class analizador {
    constructor(codigo, lista_tokens){
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
        while (i < this.codigo.length){
            token = this.extraerSgteToken(i);
            this.lista_tokens.push(token)
            i = token.siguiente + 1;
        }
        console.log(this.lista_tokens);
    };
    extraerSgteToken = (i) =>{
        let token = this.extraerEntero(i);
        if (token)
            return token;
        token = this.extraerString(i);
        if (token)
            return token;
        token = this.extraerIdentificador(i);
        if (token)
            return token;
        return new Token(Token.NO_RECONOCIDO, this.codigo.charAt(i), 'ERROR', i);
    };
    extraerEntero = (i) =>{
        //Si empieza por un digito
        //Se declara el inicio de la posicion.
        /* 
        if (this.codigo.charAt(i)){
            let pos = i;
            while(i <= this.codigo.lenght && this.codigo.charAt(i) != ` ` && esdigito){
                i++;
            }
            return new Token(Tokens.ENTERO, this.codigo.substring(pos, i), `OK`, i);
        }*/
        //Seguir extrayendo digitos mientras i < codigo.lengt y el caracter en i sea digito.
        return null;
    };
    /**
     * @description: Extrae un identificador del codigo fuente.
     * @param {*} i : Posicion inicial en el codigo fuente. Si es identificador pos sera inicial e i sera final.
     * @returns : token o null si no es identificador.
     */
    extraerIdentificador(i){
        if (this.codigo.charAt(i) == `$`){
            let pos = i;
            i++;
            while(i <= this.codigo.length && this.codigo.charAt(i) != ` `){
                i++;
            }
            console.log(`Se extrajo un identificador.`);
            return new Token(Tokens.IDENTIFICADOR, this.codigo.substring(pos, i), `OK`, i)
        }
        return null;
    };
    extraerString(i){
        if (this.codigo.charAt(i) == `/`){
            let pos = i;
            i++;
            while (i < this.codigo.length && this.codigo.charAt(i) != `/`){
                i++;
            }
            i++;
            console.log(`Se extrajo un STRING`);
            return new Token(Tokens.CADENA_CARACTERES, this.codigo.substring(pos, i), `OK`, i);
        }
    }
    extraerDecimal = (i) =>{

    };
}
const a = new analizador("$id @@@ /Una cadena@@@ſ€ſđſ@ŋđ/", []);
a.analizar();