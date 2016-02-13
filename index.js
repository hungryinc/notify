module.exports = function(service) {
    var queue = [],
        eventListeners = [];

    var generateId = function() {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)),
            a = (randLetter + Date.now()).split(""),
            n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        var uniqid = a.join("");

        return uniqid;
    }

    this.late = function(late) {
        if (late) {
            for (var i = 0; i < queue.length; i++) {
                this.trigger(queue[i][0], queue[i][1]);
                queue.splice(i, 1);
            };
        }
    }

    this.on = function(name, callback, late, unique) {
        var id = generateId();

        if (unique) {
            for (var i = 0; i < eventListeners.length; i++) {
                
                if (eventListeners[i].unique && eventListeners[i].unique == unique) {
                    eventListeners.splice(i, 1);
                }
            }
        }

        eventListeners.push({
            id: id,
            name: name,
            callback: callback,
            unique: unique
        });

        this.late(late);

        return id;
    }

    this.remove = function(id) {
        for (var i = 0; i < eventListeners.length; i++) {
            
            if (eventListeners[i].id == id) {
                console.log('Remove')
                eventListeners.splice(i, 1);
            }
        }
    }

    this.once = function(name, callback, late) {
        var id = generateId();

        eventListeners.push({
            id: id,
            name: name,
            callback: callback,
            once: true
        });

        this.late(late);

        return id;
    }

    this.trigger = function(name, args) {
        var fired = false;
        for (var i = 0; i < eventListeners.length; i++) {
            var names = eventListeners[i].name.split(" ");

            for (var k = 0; k < names.length; k++) {
                if (names[k] == name) {
                    var data = args || {};

                    eventListeners[i].event = name;
                    angular.extend(eventListeners[i], service);

                    eventListeners[i].callback(name, data);
                    fired = true;

                    if (eventListeners[i].once) {
                        eventListeners.splice(i, 1);
                    }
                }
            };
        }

        if ( ! fired) {
            queue.push([name, args])
        }
    }
}