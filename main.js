class Page {
    constructor() {
        this.stored = []
    }
    drawAll(render, manager, mode) {
        render.blockSave()
        if (mode == 'generate') {
            let manager = arguments[1]
            manager.setNewPerson().then(() => {
                render.renderAll(manager)
                render.unblockSave()
            }).catch(err => {
                console.log(err)
            }) 
        } else {
            render.renderAll(manager)
        } 
    }
    saveUser(manager) {
        let storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || []
        manager.person.saved = true
        if (storedUsers.length != 0) {
            manager.person.id = storedUsers[storedUsers.length - 1].person.id + 1
        } else {
            manager.person.id = storedUsers.length
        }
        storedUsers.push(manager)
        localStorage.setItem("userProfiles", JSON.stringify(storedUsers))
    }

    chooseUser(id, manager) {
        let user = this.stored.find(el => el.person.id == id) || this.stored[0]
        manager.setUser(user)   
    }

    removeUser(id) {
        let storedUsers = JSON.parse(localStorage.getItem("userProfiles"))
        let index = storedUsers.findIndex(el => el.person.id == id) || 0
        storedUsers.splice(index, 1)
        localStorage.setItem("userProfiles", JSON.stringify(storedUsers))
    }

    getUserList() {
        let storedUsers = JSON.parse(localStorage.getItem("userProfiles")) || []
        this.stored = storedUsers
    }
}
$(document).ready(function() {
    let manager = new APIManager()
    let render = new Renderer()
    let page = new Page()

    render.blockSave()
    page.getUserList()

    if(page.stored.length != 0) {
        page.chooseUser(0, manager)
        page.drawAll(render, manager)
        render.showFirst()
    }

    $('.generate-first').click(() => {
        page.drawAll(render, manager, 'generate')
        render.showFirst()
    })

    $('#generate').click(() => {
        page.drawAll(render, manager, 'generate')
    })

    $('#save').click(() => {
        page.saveUser(manager)
        render.renderUser(manager.person)
        render.blockSave()
    })

    $('#display').click(() => {
        page.getUserList()
        render.renderStored(page.stored)
        render.togglePopup()
    })

    $('#remove').click(() => {
        page.removeUser(manager.person.id)
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
        page.removeUser(id)
        page.getUserList()
        render.renderStored(page.stored)
    })

    $('body').on('click', '.stored-users__user', function() {
        page.chooseUser($(this).closest('li').data().id, manager)
        page.drawAll(render, manager)
    })
})