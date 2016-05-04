Meteor.methods({
	getJournal: function(id){
		var data=Cash.Collection.Journal.findOne(id);
			  data.voucherId = data.voucherId.slice(8);
			  return data;

	}
})