cashRoutes.route('/journalReport', {
  name: 'cash.journalReport',
  subscriptions: function (params, queryParams) {
    this.register('cash_staff', Meteor.subscribe('cash_staff'));
  },
  action: function(params, queryParams) {
    Layout.main('cash_journalReport');
  },
  breadcrumb: {
    //params: ['id'],
    //queryParams: ['show', 'color'],
    title: 'journalReport Report',
    parent: 'cash.home'
  }
});

cashRoutes.route('/journalReportGen', {
  name: 'cash.journalReportGen',
  subscriptions: function (params, queryParams) {
    this.register('cash_staff', Meteor.subscribe('cash_staff')),
    this.register('cash_openingClosingBalance', Meteor.subscribe(
        'cash_openingClosingBalance'));
  },
  action: function(params, queryParams) {
    Layout.report('cash_journalReportGen');
  }
});
