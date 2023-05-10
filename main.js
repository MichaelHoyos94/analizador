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
        let i = o;
    };
    extraerSgteToken = (i) =>{
        const token = {};
        token = extraerEntero(i);
        if (!token)
            extraerDecimal(i)
    };
    extraerEntero = (i) =>{
        //Si empieza por un digito
        //Se declara el inicio de la posicion.
        let pos = i;
        //Seguir extrayendo digitos mientras i < codigo.lengt y el caracter en i sea digito.
        return new Token(Tokens.ENTERO, this.codigo.substring(pos, i), `OK`, i);
    };
    extraerDecimal = (i) =>{

    };
}

console.log(Tokens.NO_RECONOCIDO);