// Declare template
let indexTpl = Template.Cpanel_exchange,
    newTpl = Template.Cpanel_exchangeNew,
    editTpl = Template.Cpanel_exchangeEdit,
    showTpl = Template.Cpanel_exchangeShow;

// Index
indexTpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify("exchange", {size: 'lg'});
});

indexTpl.events({
    'click .js-create' (e, t) {
        alertify.exchange(fa("plus", "Exchange"), renderTemplate(newTpl));
    },
    'click .js-update' (e, t) {
        alertify.exchange(fa("pencil", "Exchange"), renderTemplate(editTpl, this));
    },
    'click .js-destroy' (e, t) {
        var id = this._id;

        alertify.confirm(
            fa("remove", "User"),
            "Are you sure to delete [" + id + "]?",
            function () {

                Cpanel.Collection.Exchange.remove( id, function(error) {
                    if (error) {
                        alertify.error(error.message);
                    } else {
                        alertify.success("Success");
                    }
                });
            },
            null);


      /*  destroyAction(
            Cpanel.Collection.Exchange,
            {_id: this._id},
            {title: 'Exchange', item: moment(self.exDate).format('DD/MM/YYYY')}
        );*/
    },
    'click .js-display' (e, t) {
        alertify.alert(fa("eye", "Exchange"), renderTemplate(showTpl, this).html);
    }
});

// New
newTpl.helpers({
    doc () {
        let khr = 0, usd = 0, thb = 0;
        let baseCurrency = Cpanel.Collection.Setting.findOne().baseCurrency;

        if (baseCurrency == 'KHR') {
            khr = 1;
        } else if (baseCurrency == 'USD') {
            usd = 1;
        } else {
            thb = 1;
        }

        return {base: baseCurrency, khr: khr, usd: usd, thb: thb};
    }
});

// Edit
editTpl.onCreated(function () {
    let self = this;
    self.autorun(function () {
        self.subscribe('Cpanel.exchange', {_id: self.data._id});
    });
});

editTpl.helpers({
    data () {
        let data = Cpanel.Collection.Exchange.findOne(this._id);
        return data;
    }
});

// Show
showTpl.onCreated(function () {
    let self = this;
    self.autorun(function () {
        self.subscribe('Cpanel.exchange', {_id: self.data._id});
    });
});

showTpl.helpers({
    data () {
        let data = Cpanel.Collection.Exchange.findOne(this._id);
        data.ratesVal = JSON.stringify(data.rates);
        return data;
    }
});

// Hook
AutoForm.hooks({
    Cpanel_exchangeNew: {
        onSuccess: function (formType, result) {
            alertify.exchange().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    Cpanel_exchangeEdit: {
        onSuccess: function (formType, error) {
            alertify.exchange().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});