/* ============================================================
   Guilherme Rezende de Sá — Portfólio
   Carregado com <script src="java.js" defer> no fim do <head>.
   ============================================================ */

(function () {
    "use strict";

    var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* --------------------------------------------------------
       Header ganha borda ao sair do topo
       -------------------------------------------------------- */
    var header = document.querySelector(".site-header");

    function atualizarHeader() {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 12);
    }

    atualizarHeader();
    window.addEventListener("scroll", atualizarHeader, { passive: true });

    /* --------------------------------------------------------
       Efeito de cursor na home: a malha de pontos e o brilho
       dourado acompanham o mouse. Só em telas com mouse de
       verdade — em toque não faz sentido e gastaria bateria.
       -------------------------------------------------------- */
    var hero = document.querySelector(".hero");
    var temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (hero && temMouse && !reduzirMovimento) {
        var mx = 0;
        var my = 0;
        var agendado = false;

        function aplicarPosicao() {
            agendado = false;
            hero.style.setProperty("--mx", mx + "px");
            hero.style.setProperty("--my", my + "px");
        }

        hero.addEventListener("mousemove", function (e) {
            var area = hero.getBoundingClientRect();
            mx = e.clientX - area.left;
            my = e.clientY - area.top;

            /* Um repaint por quadro, não um por evento de mouse. */
            if (!agendado) {
                agendado = true;
                requestAnimationFrame(aplicarPosicao);
            }
        }, { passive: true });

        hero.addEventListener("mouseenter", function () {
            hero.classList.add("pointer-active");
        });

        hero.addEventListener("mouseleave", function () {
            hero.classList.remove("pointer-active");
        });
    }

    /* --------------------------------------------------------
       Contador de cada categoria: conta os cartões da grade
       logo abaixo do cabeçalho. Adicionou ou tirou um projeto
       do HTML, o número se ajusta sozinho.
       -------------------------------------------------------- */
    document.querySelectorAll(".group-head").forEach(function (head) {
        var contador = head.querySelector(".group-count");
        var grade = head.nextElementSibling;
        if (!contador || !grade || !grade.classList.contains("projects")) return;

        var total = grade.querySelectorAll(".card").length;
        contador.textContent = String(total).padStart(2, "0") +
                               (total === 1 ? " projeto" : " projetos");
    });

    /* --------------------------------------------------------
       Elementos surgem conforme entram na tela
       -------------------------------------------------------- */
    var reveals = document.querySelectorAll(".reveal");

    if (reduzirMovimento || !("IntersectionObserver" in window)) {
        reveals.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
        /* threshold 0: no celular os cartões são altos, e esperar 15%
           deles entrarem deixava um buraco vazio na tela antes de surgirem. */
        var revelador = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revelador.unobserve(entry.target);
            });
        }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

        reveals.forEach(function (el) { revelador.observe(el); });
    }

    /* --------------------------------------------------------
       Vídeos: tocam sozinhos ao rolar e pausam fora da tela.
       Não depende do "Reduzir movimento": são demonstrações
       mudas, com controles, e o autoplay é o que se espera aqui.
       Play/pause manual fica com os controles nativos.
       -------------------------------------------------------- */
    var videos = document.querySelectorAll(".card-media video");
    var visiveis = [];

    function tocar(video) {
        var p = video.play();
        if (p && typeof p.catch === "function") {
            p.catch(function () { /* bloqueado: o toque abaixo tenta de novo */ });
        }
    }

    videos.forEach(function (video) {
        /* O Safari do iPhone só libera autoplay para vídeo mudo e
           inline — reforça pelas propriedades, não só pelo HTML. */
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute("webkit-playsinline", "");

        /* Separa a pausa feita pelo script da pausa feita pela pessoa,
           para o toque abaixo não religar um vídeo pausado de propósito. */
        video.addEventListener("pause", function () {
            if (video.dataset.pausaAuto) {
                delete video.dataset.pausaAuto;
            } else {
                video.dataset.pausadoManual = "1";
            }
        });
        video.addEventListener("play", function () {
            delete video.dataset.pausadoManual;
        });
    });

    if ("IntersectionObserver" in window) {
        /* rootMargin: começa um pouco antes de o vídeo entrar na tela,
           para já chegar carregando em vez de parado. */
        var reprodutor = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var video = entry.target;
                var i = visiveis.indexOf(video);

                if (entry.isIntersecting) {
                    if (i === -1) visiveis.push(video);
                    tocar(video);
                } else {
                    if (i !== -1) visiveis.splice(i, 1);
                    delete video.dataset.pausadoManual;
                    if (!video.paused) {
                        video.dataset.pausaAuto = "1";
                        video.pause();
                    }
                }
            });
        }, { rootMargin: "250px 0px" });

        videos.forEach(function (video) { reprodutor.observe(video); });

        /* No Modo Pouca Energia o iPhone bloqueia todo autoplay. Um
           toque em qualquer lugar da página conta como permissão. */
        var liberarNoToque = function () {
            visiveis.forEach(function (video) {
                if (video.paused && !video.dataset.pausadoManual) tocar(video);
            });
        };
        document.addEventListener("touchend", liberarNoToque, { passive: true });
        document.addEventListener("click", liberarNoToque);
    }
})();
