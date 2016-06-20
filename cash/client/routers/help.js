accRoutes.route('/help', {
    name: 'cash.help',
    action: function (params, queryParams) {
        /*Layout.main('cash_help');*/
        BlazeLayout.render('helpLayout',{ content: 'cash_help'})
    },
    breadcrumb: {
        title: 'Home'
    }
});

