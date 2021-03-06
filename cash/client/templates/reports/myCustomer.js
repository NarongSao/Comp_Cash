var reportTpl = Template.cash_myCustomerReport,
    generateTpl = Template.cash_myCustomerReportGen;

reportTpl.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});

generateTpl.helpers({
    title: function () {
        var self = this;

        return {
            company: function () {
                return Cpanel.Collection.Company.findOne();
            },
            reportName: 'My Customer Report',
            date: self.date
        };
    },
    header: function () {
        var self = this;
        var branch = Cpanel.Collection.Branch.findOne();

        return [
            {col1: 'Branch: ' + branch.enName, col2: 'Customer: ' + self.name, col3: 'Filter: ....'},
            {col1: 'Gender: ', col2: 'Filter: ...........'}
        ];
    },
    content: function () {
        var self = this;

        var selector = {};

        if (!_.isEmpty(self.name)) {
            selector.name = {$regex: self.name};
        }

        var content = Cash.Collection.Customer.find(selector);

        if (content.count() > 0) {
            return content;
        } else {
            return false;
        }
    }
});