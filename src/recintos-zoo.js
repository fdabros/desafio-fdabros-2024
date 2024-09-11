const especies = {
    LEAO: { tamanho: 3, biomas: ['savana', 'savana e rio'], carnivoro: true },
    LEOPARDO: { tamanho: 2, biomas: ['savana', 'savana e rio'], carnivoro: true },
    CROCODILO: { tamanho: 3, biomas: ['rio', 'savana e rio'], carnivoro: true },
    MACACO: { tamanho: 1, biomas: ['savana', 'floresta', 'savana e rio'], carnivoro: false },
    GAZELA: { tamanho: 2, biomas: ['savana', 'savana e rio'], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio', 'savana e rio'], carnivoro: false, tolerancia: true }
};

class Recinto {
    constructor(numero, bioma, tamanhoTotal, animaisExistentes) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisExistentes = animaisExistentes; 
    }

    calcularEspacoLivre() {
        let espacoOcupado = this.animaisExistentes.reduce((total, animal) => {
            const espacoAnimal = especies[animal.especie].tamanho * animal.quantidade;
            return total + espacoAnimal;
        }, 0);
        return this.tamanhoTotal - espacoOcupado;
    }
}

class RecintosZoo {
    constructor() {
        this.recintos = [
            new Recinto(1, 'savana', 10, [{ especie: 'MACACO', quantidade: 3 }]),
            new Recinto(2, 'floresta', 5, []),
            new Recinto(3, 'savana e rio', 7, [{ especie: 'GAZELA', quantidade: 1 }]),
            new Recinto(4, 'rio', 8, []),
            new Recinto(5, 'savana', 9, [{ especie: 'LEAO', quantidade: 1 }])
        ];
    }

    validarEntradas(animal, quantidade) {
        if (!especies[animal]) {
            return { erro: 'Animal inválido' };
        }
        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }
        return null;
    }

    recintoViavel(recinto, animal, quantidade) {
        const especieInfo = especies[animal];
        
        if (!especieInfo.biomas.includes(recinto.bioma)) {
            return false;
        }

        if (especieInfo.carnivoro && recinto.animaisExistentes.length > 0) {
            const outroAnimal = recinto.animaisExistentes[0].especie;
            if (outroAnimal !== animal) {
                return false;
            }
        }

        let espacoNecessario = especieInfo.tamanho * quantidade;
        if (recinto.animaisExistentes.length > 0) {
            espacoNecessario += 1;
        }

        const espacoLivre = recinto.calcularEspacoLivre();
        return espacoNecessario <= espacoLivre;
    }

    analisaRecintos(animal, quantidade) {
        const erro = this.validarEntradas(animal, quantidade);
        if (erro) return erro;

        const recintosViaveis = this.recintos
            .filter(recinto => this.recintoViavel(recinto, animal, quantidade))
            .map(recinto => {
                const espacoLivre = recinto.calcularEspacoLivre() - (especies[animal].tamanho * quantidade);
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
            });

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        return { recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };

