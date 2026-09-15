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
       Elementos surgem conforme entram na tela
       -------------------------------------------------------- */
    var reveals = document.querySelectorAll(".reveal");

    if (reduzirMovimento || !("IntersectionObserver" in window)) {
        reveals.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
        var revelador = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revelador.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

        reveals.forEach(function (el) { revelador.observe(el); });
    }

    /* --------------------------------------------------------
       Vídeos: tocam só quando visíveis.
       Economiza banda — são mais de 240 MB no total.
       -------------------------------------------------------- */
    var videos = document.querySelectorAll(".card-media video");

    if (!reduzirMovimento && "IntersectionObserver" in window) {
        var reprodutor = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var video = entry.target;
                if (entry.isIntersecting) {
                    var p = video.play();
                    if (p && typeof p.catch === "function") {
                        p.catch(function () { /* navegador bloqueou: ignora */ });
                    }
                } else if (!video.paused) {
                    video.pause();
                }
            });
        }, { threshold: 0.45 });

        videos.forEach(function (video) { reprodutor.observe(video); });
    }

    /* --------------------------------------------------------
       Clique no vídeo alterna play/pause
       -------------------------------------------------------- */
    videos.forEach(function (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                var p = video.play();
                if (p && typeof p.catch === "function") { p.catch(function () {}); }
            } else {
                video.pause();
            }
        });
    });
})();
