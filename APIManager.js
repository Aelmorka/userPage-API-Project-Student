class APIManager {
    constructor() {
        this.person = null
        this.quote = null
        this.pokemon = null
        this.meat = null
        this.friends = []
        this.gif = null
    }

    genIndex(maxNum) {
        return Math.floor(Math.random() * maxNum) + 1
    }

    async getPerson() {
        let person = await $.get(personAPI)
        return person.results[0]
    }

    async getFriends() {
        let friends = await $.get(friendsAPI)
        return friends.results
    }

    async getQuote() {
        let quote = await $.get(quoteAPI)
        return quote
    }

    async getPokemon() {
        let pokemon = await $.get(pokemonAPI + this.genIndex(maxPokemonNum))
        return { name: pokemon.name, sprites: pokemon.sprites }
    }

    async getMeat() {
        let meat = await $.get(meatAPI)
        return meat
    }

    async getGif(search) {
        let gif = await $.get(gifAPI + search)
        return gif.data[0].embed_url
    }

    async setNewPerson() {
        let user = this.getPerson()
        let meat = this.getMeat()
        let quote = this.getQuote()
        let friends = this.getFriends()
        let pokemon = await this.getPokemon()
        let gif = this.getGif(pokemon.name)
        return Promise.all([user, meat, quote, friends, gif]).then(values => {
                this.person = values[0]
                this.meat = values[1]
                this.quote = values[2]
                this.friends = values[3]
                this.gif = values[4]
                this.pokemon = pokemon
        })
    }

    setUser(user) {
        this.person = user.person
        this.meat = user.meat
        this.quote = user.quote
        this.friends = user.friends
        this.pokemon = user.pokemon 
        this.gif = user.gif  
    }
}
