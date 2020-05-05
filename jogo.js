console.log('[DevSoutinho] Flappy Bird');
console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
function criaPlanoDeFundo() {
    const planoDeFundo = {
        spriteX: 390,
        spriteY: 0,
        largura: 275,
        altura: 204,
        x: 0,
        y: canvas.height - 204,

        atualiza() {
            const movimentoDoPlanoDeFundo = 0.7;
            const repeteEm = planoDeFundo.largura;
            const movimentacao = planoDeFundo.x - movimentoDoPlanoDeFundo;

            planoDeFundo.x = movimentacao % repeteEm;
        },

        desenha() {
            contexto.fillStyle = '#70c5ce';
            contexto.fillRect(0, 0, canvas.width, canvas.height)

            for (i = 0; i < 3; i++) {
                contexto.drawImage(
                    sprites,
                    planoDeFundo.spriteX, planoDeFundo.spriteY,
                    planoDeFundo.largura, planoDeFundo.altura,
                    (planoDeFundo.x + (i * planoDeFundo.largura)), planoDeFundo.y,
                    planoDeFundo.largura, planoDeFundo.altura,
                );
            };
        },
    };
    return planoDeFundo;
};

// [Chao]
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            // console.log('[chao.x]', chao.x);
            // console.log('[repeteEm]',repeteEm);
            // console.log('[movimentacao]', movimentacao % repeteEm);

            chao.x = movimentacao % repeteEm;
        },
        desenha() {

            for (i = 0; i < 2; i++) {
                contexto.drawImage(
                    sprites,
                    chao.spriteX, chao.spriteY,
                    chao.largura, chao.altura,
                    (chao.x + (i * chao.largura)), chao.y,
                    chao.largura, chao.altura,
                );
            };
        },
    };
    return chao;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            console.log('devo pular');
            console.log('[antes]', flappyBird.velocidade);
            flappyBird.velocidade = -flappyBird.pulo;
            console.log('[depois]', flappyBird.velocidade);
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                console.log('Fez colisao');
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);
                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            console.log('passouOIntervalo', passouOIntervalo)

            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao
            }
            // console.log('[incremento]', incremento);
            // console.log('[baseRepeticao]',baseRepeticao);
            // console.log('[frame]', incremento % baseRepeticao);
        },
        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX, spriteY, // Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}


/// [mensagemGetReady]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }
}


// 
// [Telas]
// 
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {}

Telas.INICIO = {
    inicializa() {
        globais.planoDeFundo = criaPlanoDeFundo();
        globais.chao = criaChao();
        globais.flappyBird = criaFlappyBird();
    },
    desenha() {
        globais.planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        mensagemGetReady.desenha();
    },
    click() {
        mudaParaTela(Telas.JOGO);
    },
    atualiza() {
        globais.planoDeFundo.atualiza();
        globais.chao.atualiza();
    }
};


Telas.JOGO = {
    desenha() {
        globais.planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.planoDeFundo.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
    }
};

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}


window.addEventListener('click', function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();