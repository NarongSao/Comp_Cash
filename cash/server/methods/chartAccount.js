Meteor.methods({
    getChartAccount: function () {
        return Cash.Collection.ChartAccount.find().fetch();
    },
    getChartAccountById: function (id) {
        return Cash.Collection.ChartAccount.findOne({_id: id});
    },
    removeChartAccountById: function (id) {
        return Cash.Collection.ChartAccount.remove({_id: id});
    }
});


