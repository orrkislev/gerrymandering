Vue.component('city', {
	props: {'name':String,
			'votes':Array,
			'sum':Number
			},
	data: function () {
		return {
			expanded: false
			}
		},
	template:'#city-template',
	methods:{
		openAndClose: function(){
			this.expanded = !this.expanded;
			}
		}
});

var vm = new Vue({
	el: "#main",
	data: {
		showThreshold:30000,
		listAll:[],
		lists:[]
		},
	mounted: function(){
			votesData = json;
			for (city in votesData){
				allVotes = 0;
				cityVotes = [];
				for (party in votesData[city]){
					allVotes += votesData[city][party];
					cityVotes.push({name:party,votes:votesData[city][party]});
				}
				cityVotes.sort(function(a, b){return b.votes-a.votes});
				this.listAll.push({name:city, votes:cityVotes, sum:allVotes});
			}
		},
	methods:{
			changeThreshold: function (evt){
				showThreshold = evt.target.value;
			},
			updateChange: function (evt){
				console.log(evt);
			},
			remove: function(id){
				for (i = 0;i<this.lists[id].listItems.length;i++){
					item = this.lists[id].listItems[i]
					this.listAll.push(item);
				}
				this.lists.splice(id,1);
			},
			addList: function(){
				console.log("add List");
				this.lists.unshift(
					{   
						listName:'new list',
						listItems:[]
					}
				);
			},
			listTotal: function(id){
				totalVotes = {};
				for (i = 0; i<this.lists[id].listItems.length; i++){
					item = this.lists[id].listItems[i];
					for (j=0;j<item.votes.length;j++){
						party = item.votes[j]
						if (!(party.name in totalVotes)){
							totalVotes[party.name] = 0;
						}
						totalVotes[party.name] += party.votes;
					}
				}
				var sortable = [];
				sum = 0
				for (party in totalVotes) {
					sortable.push([party, totalVotes[party]]);
					sum += totalVotes[party]
				}
				sortable = sortable.sort(function(a,b) { return b[1]-a[1] });
				return [sortable[0][0],sum]
			}
		}
	});