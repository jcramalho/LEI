var Curso = module.exports
var Connection = require('./connection')
var Publicacao = require('./publicacao')
var Ano = require('./ano')



Curso.getCurso = async function(idCurso){
    try{
        var info = await Curso.getCursoAtomica(idCurso)
        var anos = await Curso.getAnosFromCurso(idCurso)
        var estudantes = await Curso.getEstudantesFromCurso(idCurso)
        var responsaveis = await Curso.getResponsaveisFromCurso(idCurso)
        //var publicacoes = await Curso.getPublicacoesFromCurso(idCurso)

        var curso = {
            info : info[0], 
            anos : anos,
            estudantes : estudantes,
            responsaveis : responsaveis,
            //publicacoes : publicacoes
        }

        return curso
    }
    catch(e){
        throw e
    }

}



Curso.getCursoAtomica = async function(idCurso){
    var query = `
    select ?designacao where{
        c:${idCurso} c:nome ?designacao .
    }
    `

    return Connection.makeQuery(query)
}

Curso.getCursos = async function(){
    var query = `
    select (STRAFTER(STR(?cours), 'UMbook#') as ?curso) where{
        ?cours a c:Curso .
    }
    `
    return Connection.makeQuery(query)
    
}

Curso.getAnosFromCurso = async function(idCurso){
    var query = `
    select (STRAFTER(STR(?years), 'UMbook#') as ?ano) where{
        c:${idCurso} a c:Curso .
        ?curs c:pussuiAno ?years .
    }
    `

    return Connection.makeQuery(query)

}

Curso.getEstudantesFromCurso = async function(idCurso){
    var query = `
    select (STRAFTER(STR(?estudante), 'UMbook#') as ?id) ?dataNascimento ?nome ?numeroAluno ?numeroTelemovel ?sexo where{
        ?estudante c:frequenta c:${idCurso} .
        ?estudante c:dataNasc ?dataNascimento . 
        ?estudante c:nome ?nome .
        ?estudante c:numAluno ?numeroAluno .
        ?estudante c:numTelemovel ?numeroTelemovel .
        ?estudante c:sexo ?sexo . 
    }
    `

    return Connection.makeQuery(query)

}

getResponsaveisAnos = async function(anos){
    responsaveisAnos = []

    for(let i = 0; i < anos.length ; i++ ){
        responsaveis = await Ano.getResponsaveisFromAno(anos[i].ano)
        var resp = {
            ano : anos[i].ano,
            responsaveis : responsaveis
        }
        responsaveisAnos.push(resp)
    }

    return responsaveisAnos
}

Curso.getResponsaveisFromCurso = async function(idCurso){

    var anos = await Curso.getAnosFromCurso(idCurso)
    var responsaveisAnos = await getResponsaveisAnos(anos)

    return responsaveisAnos
}

Curso.getPublicacoesFromCurso = async function(idCurso){
    var query = `
    select (STRAFTER(STR(?pub), 'UMbook#') as ?idPub)
        pub? éPublicadaEm c:${idCurso} .
    `

    var resultado = await Connection.makeQuery(query).map(obra => { return Publicacao.getPublicacao()  }) ;

    return resultado

}