"use strict";var vm=new Vue({el:"#app",data:{produtos:[],produto:!1,carrinho:[],mensagemAlerta:"item adicionado",alertaAtivo:!1,carrinhoActive:!1},filters:{numberForPrice:function(t){return t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}},computed:{carrinhoTotal:function(){var o=0;return this.carrinho.length&&this.carrinho.forEach(function(t){o+=t.preco}),o}},methods:{fetchProducts:function(){var o=this;fetch("./api/produtos.json").then(function(t){return t.json()}).then(function(t){o.produtos=t})},fetchProduct:function(t){var o=this;fetch("./api/produtos/"+t+"/dados.json").then(function(t){return t.json()}).then(function(t){o.produto=t})},clickForaCarrinho:function(t){t.target===t.currentTarget&&(this.carrinhoActive=!1)},fecharModal:function(t){t.target===t.currentTarget&&(this.produto=!1)},abrirModal:function(t){this.fetchProduct(t),window.scrollTo({top:0,behavior:"smooth"})},adicionarItem:function(){this.produto.estoque--;var t=this.produto,o=t.id,r=t.nome,t=t.preco;console.log(o,r,t),this.carrinho.push({id:o,nome:r,preco:t}),this.alerta(r+" Adicionado ao carrinho")},removerItem:function(t){this.carrinho.splice(t,1)},checarLocalStorage:function(){window.localStorage.carrinho&&(this.carrinho=JSON.parse(window.localStorage.carrinho))},compararEstoque:function(){var o=this,t=this.carrinho.filter(function(t){return t.id===o.produto.id});this.produto.estoque-=t.length},alerta:function(t){var o=this;this.mensagemAlerta=t,this.alertaAtivo=!0,setTimeout(function(){o.alertaAtivo=!1},1500)},router:function(){var t=document.location.hash;t&&this.fetchProduct(t.replace("#",""))}},watch:{produto:function(){document.title=this.produto.nome||"Techno";var t=this.produto.id||"";history.pushState(null,null,"#"+t),this.produto&&this.compararEstoque()},carrinho:function(){window.localStorage.carrinho=JSON.stringify(this.carrinho)}},created:function(){this.fetchProducts(),this.router(),this.checarLocalStorage()}});