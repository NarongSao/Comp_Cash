// Declare template
var journalDetailTpl = Template.cash_journalDetail;

journalDetailTpl.onCreated(function(){
    this.itemsCollection = new Mongo.Collection(null);
})

/**
 * JournalDetail
 */
journalDetailTpl.onRendered(function () {
    $('.tmpAccount').select2();
});


journalDetailTpl.helpers({
    chartAccount: function () {
        var listChartAccount = [];
        var chartAccList=ReactiveMethod.call('getChartAccount');
       
    
        chartAccList.forEach(function (obj) {
                var accountType = Cash.Collection.AccountType.findOne(obj.accountTypeId).name;
                listChartAccount.push({
                    _id: obj._id,
                    name: obj.name,
                    code:  obj.code,
                    accountType: accountType
                });
            });
       
        return listChartAccount;
    },

    journals: function () {
     let data = Template.currentData();
        const instance = Template.instance();

    if (data && data.transaction) {
        data.transaction.forEach((obj)=> {
            instance.itemsCollection.insert(obj);
        });
    }

        let getItems = instance.itemsCollection.find();
        return getItems;
    },
    total: function () {
        const inst=Template.instance();
        let journalDetTemp=inst.itemsCollection.find();
        var totalAmountVal = 0;
       journalDetTemp.forEach((obj)=>{
            totalAmountVal += formatToNumber(obj.amount);
        })
        /*var totalAmount = formatNumberToSeperate(math.round(totalAmountVal, 2).toString());*/
        return totalAmountVal;

    },
    keyArgs(index, name){
        return `transaction.${index}.${name}`;
    }
});

journalDetailTpl.events({
    
    'click .addItem': function (e, t) {
        let accountOrg= $('[name="tmpAccount"]').val();
        let amount=$('[name="tmpAmount"]').val();

      t.itemsCollection.insert({accountOrg: accountOrg, amount: amount});
    },
    'click .removeItem': function (e, t) {
        var self = this;
       t.itemsCollection.remove(self._id);
    },
    'keypress .amount,.tmpAmount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    }
    
});
var formatNumberToSeperate = function (val) {
        val = val.toString();
        var parts = (val.replace(/,/g, "")).toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] == "" || parts[1] != null ? "." + parts[1] : "");
    },
    formatToNumber = function (val) {
        var regex = /^\d+(\.\d{1,2})?$/i;
        if (!regex.test(val)) {
            val = val.replace(/,/g, "");
        }
        return parseFloat(val);
    };



