// Declare template
var indexTpl = Template.cash_help;

indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Cash Help',
        description: 'Description for this page'
    });
});

indexTpl.onRendered(function () {
    $('body').scrollspy({
        target: '.bs-docs-sidebar',
        offset: 40
    });
});

indexTpl.events({
});
