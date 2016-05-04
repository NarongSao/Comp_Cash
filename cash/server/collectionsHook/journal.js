// Customer
var module = 'Cash';

Cash.Collection.Journal.before.insert(function (userId, doc) {
    var transaction = [];
    _.each(doc.transaction, function (obj) {
        if (!_.isNull(obj)) {
             let accountArray= obj.accountOrg.split('|');
            let accountCode= accountArray[0].replace(" ","");
            var account= Cash.Collection.ChartAccount.findOne({code: accountCode},{fields:{name: 1,accountTypeId:1,code:1}});

            obj.accountDoc = account;
            obj.accountOrg=obj.accountOrg;
            obj.account=account._id;
    
            transaction.push(obj);
        }
    });

    var date = moment(doc.journalDate).format("YYMM");
    var prefix = doc.branchId + "-" + date;
    doc._id = idGenerator.genWithPrefix(Cash.Collection.Journal,
        prefix, 6);
    doc.transaction=transaction;
});


Cash.Collection.Journal.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    var transaction = [];
    _.each(modifier.$set.transaction, function (obj) {
        if (!_.isNull(obj)) {
             let accountArray= obj.accountOrg.split('|');
            let accountCode= accountArray[0].replace(" ","");
            var account= Cash.Collection.ChartAccount.findOne({code: accountCode},{fields:{name: 1,accountTypeId:1,code:1}});
            obj.accountDoc = account;
              obj.accountOrg=obj.accountOrg;
            obj.account=account._id;
            transaction.push(obj);
        }
    });

    modifier.$set.transaction = transaction;
});





