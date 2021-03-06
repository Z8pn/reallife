var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Account = require("./account.js");
var Interaction = require("../interaction");
var VehicleManager = require("./vehicle.js").mgr;
var ItemManager = require("./storage.js").mgr;
var LogManager = require("./logs.js");
var e = require("../libs/items.js");
class Player extends EventEmitter {
    constructor(player) {
        super();
        this.player = player;
        this.id = -1;
        this._money = 0;
        this._bankmoney = 0;
        this._group = 0;
        this._damageLog = [];
        this._hunger = 0;
        this.type = TYPE.PLAYER;
        this.account = new Account(this);
        this.appearance = new Appearance(this);
        this.logger = new LogManager("Player", player.name);
        this.inventory = new ItemManager(this);
        this.vehicles = new VehicleManager(this);
        this.player.account = this.account;
        this.player.inventory = this.inventory;
        this.player.vehicles = this.vehicles;
        this.player.appearance = this.appearance;
    }
    get authState() {
        if (!this.account.loggedIn) return 0;
        if (!this.account.user_id) return 0;
        return 1;
    }
    get status() {
        if (!this.account.status) return;
        return this.account.status;
    }
    set hunger(val) {
        this._hunger = val;
        this.player.setVariable("hunger_val", val);
        //updateHunger(progress)
    }
    set money(val) {
        // logic
        this._money = val;
    }
    set money(val) {
        this._money = val;
        this.player.setVariable("cash_hand", val);
    }
    get money() {
        return this._money;
    }
    playAnimSync(dict, name, speed, speedMultiplier, duration, flag, playbackRate, lockX, lockY, lockZ, timeout = 0) {
        let id = this.player.id;
        mp.players.forEachInRange(this.player.position, 200, (tPlayer) => {
            tPlayer.call("client:sync:playanimation", [id, dict, name, speed, speedMultiplier, duration, flag, playbackRate, lockX, lockY, lockZ, timeout])
        });
    }
    death(reason, killer, event = false) {
        this.player.setVariable("death", true);
        setTimeout(() => {
            this.spawn();
        }, 5000);
    }
    async spawn() {
        let spawnPoint = new mp.Vector3(38,-776,32);
        this.player.spawn(spawnPoint);
        this.appearance.load();
        this.inventory.load();
        this.player.dimension = 0;
        this.money = 100;
        this.player.call("server:game:start");
        this.player.setVariable("spawned", true);
        this.player.setVariable("death", false);
        this.logger.log("Spawning")
    }
    interact(key) {
        this.emit("interact", key);
    }
}
mp.events.add("playerDeath", (player, reason, killer) => {
    console.log("player died", player.name);
    if (player.interface) {
        player.interface.death(reason, killer, true);
    }
});
mp.Player.prototype.__defineGetter__("interface", function() {
    if (!this.interface_class) {
        this.interface_class = new Player(this);
        Animations.send(this);
    }
    return this.interface_class;
});