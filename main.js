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

    displayUserList(render) {
        let storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || []
        if (storedUsers.length != 0) {
            for (let i = 0; i < storedUsers.length; i++) {
                storedUsers[i].person.id = i
            }
        }
        this.stored = storedUsers
        render.renderStored(storedUsers)
    }
}
$(document).ready(function() {
    let manager = new APIManager()
    let render = new Renderer()
    let user = new User()

    render.blockSave()

    $('.generate-first').click(() => {
        user.drawAll(render, manager, 'generate')
        render.generateFirst()
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
        user.displayUserList(render)
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
    })

    $('.popup').click(() => {
        render.togglePopup()
    })

    $('body').on('click', '.stored-users__user', function() {
        user.chooseUser($(this).data().id, manager)
        user.drawAll(render, manager)
    })
})