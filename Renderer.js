class Renderer {
    constructor() {
        this.mainInfo = $('.main-info')
        this.user = $('.user-container')
        this.quote = $('.quote-container')
        this.pokemon = $('.pokemon-container')
        this.meat = $('.meat-container')
        this.friends = $('.friends-container')
        this.gif = $('.gif')
        this.save = $('#save')
        this.storedUsers = $('.stored-users')
        this.popup = $('.popup')
        const sourceUser = $('#user').html()
        this.userTemplate = Handlebars.compile(sourceUser)
        const sourceQuote = $('#quote').html()
        this.quoteTemplate = Handlebars.compile(sourceQuote)
        const sourcePokemon = $('#pokemon').html()
        this.pokemonTemplate = Handlebars.compile(sourcePokemon)
        const sourceMeat = $('#meat').html()
        this.meatTemplate = Handlebars.compile(sourceMeat)
        const sourceFriends = $('#friends').html()
        this.friendsTemplate = Handlebars.compile(sourceFriends)
        const sourceStoredUsers = $('#storedUsers').html()
        this.storedUsersTemplate = Handlebars.compile(sourceStoredUsers)
    }
    renderUser(user) {
        let html = this.userTemplate(user)
        this.user.empty()
        this.user.append(html)
    }

    renderQuote(quote) {
        let html = this.quoteTemplate(quote)
        this.quote.empty()
        this.quote.append(html)
    }

    renderPokemon(pokemon, gender) {
        let img = gender == 'female' && pokemon.sprites.front_female ? pokemon.sprites.front_female : pokemon.sprites.front_default
        let pokemonRend = {name: pokemon.name, img: img}
        let html = this.pokemonTemplate(pokemonRend)
        this.mainInfo.removeClass()
        this.mainInfo.addClass('main-info').addClass('info-block').addClass(pokemon.type)
        this.pokemon.empty()
        this.pokemon.append(html)
    }

    renderMeat(meat) {
        let html = this.meatTemplate(meat)
        this.meat.empty()
        this.meat.append(html)
    }

    renderFriends(friends) {
        let html = this.friendsTemplate({friends: friends})
        this.friends.empty()
        this.friends.append(html)
    }
    renderGif(gifLink) {
        this.gif.attr('src', gifLink)
    }

    renderAll(manager) {
        this.renderUser(manager.person)
        this.renderMeat(manager.meat)
        this.renderQuote(manager.quote)
        this.renderFriends(manager.friends)
        this.renderPokemon(manager.pokemon, manager.person.gender)
        this.renderGif(manager.gif)
    }

    renderStored(users) {
        let html = users.length != 0 ? this.storedUsersTemplate({users: users}) : $('<p>No users saved yet</p>')
        this.storedUsers.empty()
        this.storedUsers.append(html)
    }

    togglePopup() {
        this.popup.toggleClass('hidden')   
    }

    showFirst() {
        $('.container').removeClass('hidden')
        $('.generate-first').addClass('hidden')
    }

    blockSave() {
        this.save.attr('disabled', true)
    }

    unblockSave() {
        this.save.attr('disabled', false)
    }
}