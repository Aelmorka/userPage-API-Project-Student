class User {
    constructor() {
        this.stored = []
    }
    drawAll(render, manager, mode) {
        render.blockSave()
        if (mode == 'generate') {
            let manager = arguments[1]
            manager.setNewPerson().then(() => {
                this.renderAll(render, manager)
                render.unblockSave()
            }) 
        } else {
            this.renderAll(render, manager)
        } 
    }
    renderAll(render, manager) {
        render.renderUser(manager.person)
        render.renderMeat(manager.meat)
        render.renderQuote(manager.quote)
        render.renderFriends(manager.friends)
        render.renderPokemon(manager.pokemon, manager.person.gender)
    }
    saveUser(manager) {
        let storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || []
        manager.person.saved = true
        manager.person.id = storedUsers.length
        storedUsers.push(manager)
        localStorage.setItem("userProfiles", JSON.stringify(storedUsers))
    }

    chooseUser(id, manager) {
        let user = this.stored.find(el => el.person.id == id)
        manager.setUser(user)   
    }

    removeUser(id) {
        let storedUsers = JSON.parse(localStorage.getItem("userProfiles"))
        storedUsers.splice(id, 1)
        localStorage.setItem("userProfiles", JSON.stringify(storedUsers))
    }

    getUserList() {
        let storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || []
        if (storedUsers.length != 0) {
            for (let i = 0; i < storedUsers.length; i++) {
                storedUsers[i].person.id = i
            }
        }
        this.stored = storedUsers
    }
}
$(document).ready(function() {
    let manager = new APIManager()
    let render = new Renderer()
    let user = new User()

    render.blockSave()

    //console.log()
    user.getUserList()

    if(user.stored.length != 0) {
        user.chooseUser(0, manager)
        user.drawAll(render, manager)
        render.showFirst()
    }

    $('.generate-first').click(() => {
        user.drawAll(render, manager, 'generate')
        render.showFirst()
    })

    $('#generate').click(() => {
        user.drawAll(render, manager, 'generate')
    })

    $('#save').click(() => {
        user.saveUser(manager)
        render.renderUser(manager.person)
        render.blockSave()
    })

    $('#display').click(() => {
        user.getUserList()
        render.renderStored(user.stored)
        render.togglePopup()
    })

    $('#remove').click(() => {
        user.removeUser(manager.person.id)
        manager.person.saved = false
        render.renderUser(manager.person)
        render.unblockSave()
    })

    $('#clear').click(() => {
        localStorage.clear()
        manager.person.saved = false
        render.renderUser(manager.person)
        render.unblockSave()
    })
    $('body').on('click', '.popup', () => {
        render.togglePopup()
    })
    $('body').on('click', '.del', function(evt) {
        let id = $(this).closest('li').data().id
        if (evt.stopPropagation) {    // standard
            evt.stopPropagation();
        } else {    // IE6-8
             evt.cancelBubble = true;
        }
        if (manager.person.id == id) {
            manager.person.saved = false
            render.renderUser(manager.person)
            render.unblockSave()
        }
        user.removeUser(id)
        user.getUserList()
        render.renderStored(user.stored)
    })

    $('body').on('click', '.stored-users__user', function() {
        user.chooseUser($(this).data().id, manager)
        user.drawAll(render, manager)
    })
})