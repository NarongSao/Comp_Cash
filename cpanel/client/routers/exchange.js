cpanelRoutes.route('/exchange', {
    name: 'cpanel.exchange',
    subscriptions: function(params, queryParams) {
        this.register('cpanel_exchange', Meteor.subscribe('cpanel_exchange'));
    },
    action: function (params, queryParams) {
        Layout.main('Cpanel_exchange');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Exchange',
        parent: 'cpanel.welcome'
    }
});
