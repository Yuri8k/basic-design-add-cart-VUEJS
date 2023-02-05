const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: "item adicionado",
        alertaAtivo: false,
        carrinhoActive: false,
    },

    filters: {
        numberForPrice(value) {
            return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0;
            if(this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco;
                });
            }
            return total
        }
    },
    methods: {
        fetchProducts() {
            fetch("./api/produtos.json")
                .then(r => r.json())
                .then(r => {
                    this.produtos = r
                })
        },
        fetchProduct(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {
                    this.produto = r
                })
        },
        clickForaCarrinho({target, currentTarget}) {
           if(target === currentTarget) {
            this.carrinhoActive = false;
           }
        },
        fecharModal({target, currentTarget}) {
            if(target === currentTarget) {
             this.produto = false;
            }
         },
        abrirModal(id) {
            this.fetchProduct(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        adicionarItem() {
            this.produto.estoque--
            const {id, nome, preco} = this.produto;
            console.log(id, nome, preco);
            this.carrinho.push({id, nome, preco});
            this.alerta(`${nome} Adicionado ao carrinho`);
        },
        removerItem(index) {
            this.carrinho.splice(index, 1);
        },
        checarLocalStorage() {
            if(window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        compararEstoque() {
           const items = this.carrinho.filter(({ id }) => id === this.produto.id);
           this.produto.estoque -= items.length;
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500)
        },
        router() {
            const hash = document.location.hash;
            if(hash) {
                this.fetchProduct(hash.replace("#", ""));
            }
        },
    },
    watch: {
        produto() {
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || ''
            history.pushState(null, null, `#${hash}`);
            if(this.produto) {
                this.compararEstoque();
            }
        },
        carrinho() {
           window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created() {
        this.fetchProducts();
        this.router();
        this.checarLocalStorage();
    }
})