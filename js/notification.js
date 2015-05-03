/**
 * notification.js v1.0.0
 * fork from NotificationFx.js from Codrops http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;
(function (window) {

    'use strict';

    /**
     * extend obj function
     */
    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function addClass(element, myClass) {
        element.className += ' ' + myClass;
    }

    function removeClass(element, myClass) {
        var elementClass = ' ' + element.className + ' ';
        while (elementClass.indexOf(' ' + myClass + ' ') != -1)
            elementClass = elementClass.replace(' ' + myClass + ' ', '');
        element.className = elementClass;
    }

    /**
     * Notification function
     */
    function Notification(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    /**
     * Notification options
     */
    Notification.prototype.options = {
        // element to which the notification will be appended
        // defaults to the document.body
        wrapper: document.body,
        // the message
        message: '',
        // layout type: bar|other
        layout: 'bar',
        // effects for the specified layout:
        effect: 'slidetop',
        // warning, error, success
        // will add class ns-type-warning, ns-type-error or ns-type-success
        type: 'success',
        // if the user doesn´t close the notification then we remove it after 10s
        ttl: 10000,
        // callbacks
        onClose: function () {
            return false;
        },
        onOpen: function () {
            return false;
        }
    };

    /**
     * init function
     * initialize and cache some vars
     */
    Notification.prototype._init = function () {
        // create HTML structure
        this.ntf = document.createElement('div');
        this.ntf.className = 'ns-box ns-' + this.options.layout + ' ns-effect-' + this.options.effect + ' ns-type-' + this.options.type;
        var strinner = '<div class="ns-box-inner">';
        strinner += this.options.message;
        strinner += '</div>';
        strinner += '<span class="ns-close"></span></div>';
        this.ntf.innerHTML = strinner;

        // append to body or the element specified in options.wrapper
        this.options.wrapper.insertBefore(this.ntf, this.options.wrapper.firstChild);

        // dismiss after [options.ttl]ms
        var self = this;
        this.dismissttl = setTimeout(function () {
            if (self.active) {
                self.dismiss();
            }
        }, this.options.ttl);

        // init events
        this._initEvents();
    };

    /**
     * init events
     */
    Notification.prototype._initEvents = function () {
        var self = this;
        // dismiss notification
        this.ntf.querySelector('.ns-close').addEventListener('click', function () {
            self.dismiss();
        });
    };

    /**
     * show the notification
     */
    Notification.prototype.show = function () {
        this.active = true;
        removeClass(this.ntf, 'ns-hide');
        addClass(this.ntf, 'ns-show');
        this.options.onOpen();
    };

    /**
     * dismiss the notification
     */
    Notification.prototype.dismiss = function () {
        var self = this;
        this.active = false;
        clearTimeout(this.dismissttl);
        removeClass(this.ntf, 'ns-show');
        setTimeout(function () {
            addClass(self.ntf, 'ns-hide');
            // callback
            self.options.onClose();
        }, 25);

        // after animation ends remove ntf from the DOM
        var onEndAnimationFn = function (ev) {
            if (ev.target !== self.ntf) return false;
            this.removeEventListener("webkitAnimationEnd", onEndAnimationFn);
            this.removeEventListener("animationend", onEndAnimationFn);
            self.options.wrapper.removeChild(this);
        };

        this.ntf.addEventListener("webkitAnimationEnd", onEndAnimationFn);
        this.ntf.addEventListener("animationend", onEndAnimationFn);
    };

    /**
     * add to global namespace
     */
    window.Notification = Notification;

})(window);