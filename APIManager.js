class APIManager {
    constructor() {
        this.person = null
        this.quote = null
        this.pokemon = null
        this.meat = null
        this.friends = []
    }

    async getPerson() {
        let person = await $.get('https://randomuser.me/api/?inc=gender,name,email,location,picture&results=1')
        return person.results[0]
    }

    async getFriends() {
        let friends = await $.get('https://randomuser.me/api/?inc=gender,name&results=10')
        return friends.results
    }

    async getQuote() {
        let quote = await $.get('https://api.kanye.rest')
        return quote
    }

    async getPokemon(gender) {
        let index = Math.floor(Math.random() * 1000)
        let pokemon = await $.get(`https://pokeapi.co/api/v2/pokemon/${index}`)
        return { name: pokemon.name, sprites: pokemon.sprites }
    }

    async getMeat() {
        let meat = await $.get('https://baconipsum.com/api/?type=all-meat&sentences=3')
        return meat
    }

    setNewPerson() {
        let user = this.getPerson()
        let meat = this.getMeat()
        let quote = this.getQuote()
        let friends = this.getFriends()
        let pokemon = this.getPokemon()
        return Promise.all([user, meat, quote, friends, pokemon]).then(values => {
                this.person = values[0]
                this.meat = values[1]
                this.quote = values[2]
                this.friends = values[3]
                this.pokemon = values[4]
        })
    }

    setUser(user) {
        this.person = user.person
        //this.person.saved = true
        this.meat = user.meat
        this.quote = user.quote
        this.friends = user.friends
        this.pokemon = user.pokemon   
    }
}
