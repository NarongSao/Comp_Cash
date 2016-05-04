var indexTpl = Template.cash_journal;
var insertTpl = Template.cash_journalInsert;
var updateTpl = Template.cash_journalUpdate;
var transactionTpl = Template.transaction;
var showTpl = Template.cash_journalShow;

var staffAddonTpl = Template.cash_staffInsert;

var customArray = Template.afArrayField_customArray;
indexTpl.onCreated(function () {
    SEO.set({
        title: 'journal',
        description: 'journal'
    });
    createNewAlertify(['journal', 'staffAddon', 'addressAddon','journalShow']);

});

showTpl.helpers({
    formatMoney: function (val) {
        return numeral(val).format('0,0.00');
    },
    getChartAccount: function (val) {
        return Cash.Collection.ChartAccount.findOne({
            _id: val
        }).name;
    }
});

insertTpl.onRendered(function () {
    $('input[name="voucherId"]').attr('maxlength', '6');
    datePicker();
    disableDate();
});
updateTpl.onRendered(function () {
    $('input[name="voucherId"]').attr('maxlength', '6');
    datePicker();
    disableDate();
});


var disableDate = function () {
    var getLastClosing = Cash.Collection.OpeningClosingBalance.findOne({}, {
        sort: {
            date: -1
        }
    });
    var dateVal = moment(getLastClosing.date).add(1, "days").toDate();
    $("#journalDate").data('DateTimePicker').minDate(dateVal);
};


insertTpl.events({
    'keypress #voucherId,.transaction-amount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 ||
        charCode > 57));
    }/*,
    'click .save-journal': function (evt) {
        evt.preventDefault();
    }*/

});
updateTpl.events({
    'keypress #voucherId,.transaction-amount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 ||
        charCode > 57));
    }
})

indexTpl.events({
    'click .insert': function (e, t) {
        alertify.journal(fa("plus", "Transaction"), renderTemplate(insertTpl))
            .maximize();
    },
    'click .update': function (e, t) {
   
        var openingBalance = Cash.Collection.OpeningClosingBalance.findOne({}, {
            sort: {
                date: -1
            }
        });
        var self=this;
        if (self.journalDate > openingBalance.date) {

            alertify.journal(fa("pencil", "Transaction"), renderTemplate(
                updateTpl, this))
                .maximize();
        } else {
            alertify.warning("Can not Update! You already closing balance!!!")
        }
    },
    'click .remove': function (e, t) {
        var self = this;
        var openingBalance = Cash.Collection.OpeningClosingBalance.findOne({}, {
            sort: {
                date: -1
            }
        });
        if (self.journalDate > openingBalance.date) {

            alertify.confirm(
                fa("remove", "Transaction"),
                "Are you sure to delete [" + self._id + "]?",
                function (e, t) {
                    Cash.Collection.Journal.remove(self._id, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success("Success");
                        }
                    })
                }, null
            )
        } else {
            alertify.warning("Can not Remove! You already closing balance!!!")
        }
    },
    'click .show': function (e, t) {
        /*var data = Cash.Collection.Journal.findOne({
            _id: this._id
        });*/
        /*alertify.alert(renderTemplate(showTpl, data))
            .set({
                title: fa("eye", "Transaction")
            })*/

            alertify.journalShow(fa('eye', 'Journal'), renderTemplate(
                showTpl,
                this));
    }
});


insertTpl.events({
    'click .staffAddon': function (e, t) {
        alertify.staffAddon(fa("plus", "Staff"), renderTemplate(staffAddonTpl))
    }
});

updateTpl.events({
    'click .staffAddon': function (e, t) {
        alertify.staffAddon(fa("plus", "Staff"), renderTemplate(staffAddonTpl));
    }
});


updateTpl.helpers({
    data: function () {
        var data = ReactiveMethod.call('getJournal',this._id);
        return data;
    }
});

updateTpl.onCreated(function () {
    let data = Template.currentData();
    this.autorun(()=> {
        this.subscribe('cash_journalById', {_id: data._id});
    });
});

showTpl.onCreated(function () {
    let data = Template.currentData();
    this.autorun(()=> {
        this.subscribe('cash_journalById', {_id: data._id});
    });
});

insertTpl.onCreated(function () {
    $(window).keydown(function (event) {
        if (event.ctrlKey && (event.which == 13)) {
            $('.saveData').trigger("click");
            event.preventDefault();
        }
    });
});
updateTpl.onCreated(function () {
    $(window).keydown(function (event) {
        if (event.ctrlKey && (event.which == 13)) {
            $('.saveData').trigger("click");
            event.preventDefault();
        }
    });
});



// Config date picker
var datePicker = function () {
    var dob = $('[name="journalDate"]');
    DateTimePicker.date(dob);
};


AutoForm.hooks({
    cash_journalInsert: {
        before: {
            insert: function (doc) {
                var currentBranch = Session.get("currentBranch");
                doc.branchId = Session.get("currentBranch");
                var year = moment(journalDate).format("YYYY");
                doc.voucherId = currentBranch + "-" + year + s.pad($(
                        '[name="voucherId"]').val(), 6, "0");
        
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.journal().close();
            alertify.success("Success");
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    cash_journalUpdate: {
        before: {
            update: function (doc) {
                debugger;
                var currentBranch = Session.get("currentBranch");
                var year = moment(journalDate).format("YYYY");
                doc.$set.voucherId = currentBranch + "-" + year + s.pad($(
                        '[name="voucherId"]').val(), 6, "0");
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.journal().close();
            alertify.success("Success");
        },
        onError: function (formTupe, error) {
            alertify.error(error.message);
        }
    }
});

function calculateAmount() {
    var amounts = 0;
    $('#transaction-list tr').each(function (e) {
        var amount = $(this).find('.transaction-amount').val() == "" ? 0 :
            parseFloat($(this).find('.transaction-amount').val());
        amounts += amount;

    });

    $('#total-amount').val(amounts);

}
