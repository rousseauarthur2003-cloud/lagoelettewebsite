/* Script original du site, repris tel quel. */
export function initGoelette() {
(function(){
  "use strict";

  var entete=document.getElementById('entete');
  var poser=function(){entete.classList.toggle('pose',window.scrollY>40);};
  poser(); window.addEventListener('scroll',poser,{passive:true});

  var burger=document.getElementById('burger'), nav=document.getElementById('nav');
  burger.addEventListener('click',function(){
    var o=nav.classList.toggle('ouvert');
    burger.classList.toggle('actif',o);
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');
  });
  nav.addEventListener('click',function(e){
    if(e.target.tagName==='A'){nav.classList.remove('ouvert');burger.classList.remove('actif');burger.setAttribute('aria-expanded','false');}
  });

  /* Horaires : mise en avant du jour en cours */
  var j=new Date().getDay();
  var li=document.querySelector('#horaires li[data-jour="'+j+'"]');
  if(li){
    li.classList.add('jour-actuel');
    var h=li.querySelector('.h').textContent;
    var cible=document.getElementById('horaireJour');
    if(cible) cible.textContent=h;
  }

  /* Chips de la carte : surlignage de la rubrique visible */
  var chips=Array.prototype.slice.call(document.querySelectorAll('#chips a'));
  var groupes=chips.map(function(c){return document.querySelector(c.getAttribute('href'));}).filter(Boolean);
  if('IntersectionObserver' in window && groupes.length){
    var obsC=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          chips.forEach(function(c){c.classList.toggle('actif',c.getAttribute('href')==='#'+e.target.id);});
        }
      });
    },{rootMargin:'-140px 0px -65% 0px'});
    groupes.forEach(function(g){obsC.observe(g);});
  }
  var boissons=document.getElementById('m-boissons');
  chips.forEach(function(c){
    if(c.getAttribute('href')==='#m-boissons'){
      c.addEventListener('click',function(){ if(boissons) boissons.open=true; });
    }
  });

  /* Agrandissement des visuels de la carte */
  var lb=document.getElementById('lb'), lbImg=document.getElementById('lbImg');
  var ouvrirLb=function(src){lbImg.src=src;lb.classList.add('on');document.body.style.overflow='hidden';};
  var fermerLb=function(){lb.classList.remove('on');document.body.style.overflow='';};
  Array.prototype.forEach.call(document.querySelectorAll('[data-lb]'),function(b){
    b.addEventListener('click',function(){var i=b.querySelector('img'); if(i) ouvrirLb(i.currentSrc||i.src);});
  });
  document.getElementById('lbFermer').addEventListener('click',fermerLb);
  lb.addEventListener('click',function(e){if(e.target===lb)fermerLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')fermerLb();});

  /* Apparitions */
  var cibles=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vu');obs.unobserve(e.target);}});
    },{threshold:.1,rootMargin:'0px 0px -6% 0px'});
    Array.prototype.forEach.call(cibles,function(c){obs.observe(c);});
  } else {
    Array.prototype.forEach.call(cibles,function(c){c.classList.add('vu');});
  }

  document.getElementById('annee').textContent=new Date().getFullYear();
})();
}
