$(function() {
    $("body").width($(window).width())
    $("body").height($(window).height())
});
var Account = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        this.username = "";
        this.password = "";
        this.salt = "";
        this.isBlocked = false;
    }
    generateSalt() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    getFieldValues() {
        return {
            username: $("#join_username").val(),
            password: $("#join_password").val()
        }
    }
    login() {
        if (this.isBlocked == false) {
            console.log("login");
            let vals = this.getFieldValues();
            this.username = vals.username;
            this.password = vals.password;
            if (this.password.length < 3) {
                if ($("#join_password").hasClass("wrong") == false) {
                    $("#join_password").addClass("wrong");
                }
            } else {
                $("#join_password").removeClass("wrong");
            }
            if ($("#join_password").hasClass("wrong") == false) {
                console.log("username", this.username);
                console.log("password", this.password);
                mp.trigger("cef:account:login", this.username, this.password);
            } else {
                this.alert({
                    title: "Password",
                    titleSize: "16px",
                    message: "Please check your password (Min. length 4)   ",
                    messageColor: 'rgba(0,0,0,.8)',
                    position: "bottomCenter",
                    close: false
                })
            }
        }
    }
    register() {
        this.salt = this.generateSalt();
        this.username = $("#reg_username").val();
        this.password = md5($("#reg_password").val() + "|" + this.salt);
        this.password2 = md5($("#reg_password2").val() + "|" + this.salt);
        this.mail = $("#reg_email").val();
        if ($("#reg_password").val().length < 3) {
            if ($("#reg_password").hasClass("red") == false) {
                $("#reg_password").addClass("red");
            }
        } else {
            $("#reg_password").removeClass("red");
        }
        if ($("#reg_password").hasClass("red") == false) {
            console.log("username", this.username);
            console.log("password", this.password);
            if (this.password != this.password2) {
                $("#red_password2").addClass("red");
                $("#red_password2").removeClass("green");
                this.alert({
                    title: "Passwort",
                    titleSize: "16px",
                    message: "Passwörter nicht gleich",
                    messageColor: 'rgba(0,0,0,.8)',
                    position: "bottomCenter",
                    color: 'rgba(212,212,212, 0.8)',
                    progressBarColor: 'rgba(136, 48, 255, 0.6)',
                    close: false
                })
            } else {
                $("#red_password1").removeClass("red");
                $("#red_password1").addClass("green");
                if (this.mail.indexOf("@") > -1) {
                    $("#reg_email").removeClass("red");
                    $("#reg_email").addClass("green");
                    mp.trigger("cef:account:register", this.username, this.password, this.password2, this.salt, this.mail);
                } else {
                    $("#reg_email").addClass("red");
                    $("#reg_email").removeClass("green");
                    this.alert({
                        title: "eMail",
                        titleSize: "16px",
                        message: "eMail Adresse bitte korrigieren",
                        messageColor: 'rgba(0,0,0,.8)',
                        position: "bottomCenter",
                        color: 'rgba(212,212,212, 0.8)',
                        progressBarColor: 'rgba(136, 48, 255, 0.6)',
                        close: false
                    })
                }
            }
        } else {
            this.alert({
                title: "Passwort",
                titleSize: "16px",
                message: "Passwort zu kurz (min 4 zeichen)",
                messageColor: 'rgba(0,0,0,.8)',
                position: "bottomCenter",
                color: 'rgba(212,212,212, 0.8)',
                progressBarColor: 'rgba(136, 48, 255, 0.6)',
                close: false
            })
        }
    }
    alert(text) {
        this.isBlocked = false;
        /* notify({
             title: "Save",
             titleSize: "16px",
             message: "Succesfully saved your Account Data",
             messageColor: 'rgba(0,0,0,.8)',
             position: "bottomRight",
             close: false
         })*/
        iziToast.show(text);
    }
    toggle(target, origin) {
        $("#" + origin).hide();
        $("#" + target).show();
        $("#" + target).css({
            "opacity": "1"
        });
    }
}

function cef_loadlogin(name) {
    $("#join_username").val(name)
    $("#loading").animate({
        opacity: 0
    }, 100, function() {
        $("#login").show();
        $("#login").addClass("show");
    });
}

function cef_hidelogin() {
    $("#login").removeClass("show");
    $("#login").animate({
        opacity: 0,
        height: "0px"
    }, 300, function() {
        $("#login").hide();
    });
}

function cef_toggleregister() {
    if (!$("#login").hasClass("hide")) {
        $("#login").addClass("hide");
        $("#register").addClass("show");
    }
}

function alert_login(text) {
    Account.alert(text)
}