Vue.component('list-item', {
	props: {'type':String,
			'name':String,
			'items':Array,
			'sum':Number
			},
	data: function () {
		return {
			expanded: false
			}
		},
	template:'#list-item-template',
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
				this.listAll.push({type:'city', name:city, items:cityVotes, sum:allVotes});
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
						name:'new list',
						listItems:[]
					}
				);
			},
			save: function(id){
				groupName = this.lists[id].name
				groupItems = []
				groupSum = 0
				for (i = 0;i<this.lists[id].listItems.length;i++){
					item = this.lists[id].listItems[i]
					groupSum += item.sum
					groupItems.push(item)
				}
				this.listAll.push({type:'group', name:groupName, items: groupItems, sum:groupSum})
				this.lists.splice(id,1);
			},
			listTotal: function(id){
				console.log('listTotal')
				totalVotes = {};
				for (i = 0; i<this.lists[id].listItems.length; i++){
					item = this.lists[id].listItems[i];
					totalVotes = addVotesFromItem(totalVotes,item)
				}
				var sortable = [];
				sum = 0
				for (party in totalVotes) {
					sortable.push([party, totalVotes[party]]);
					sum += totalVotes[party]
				}
				sortable = sortable.sort(function(a,b) { return b[1]-a[1] });
				return ["Sum of all Votes - "+sum,"Winning Party - "+sortable[0][0]]
			}
		}
	});
	
	function addVotesFromItem(totalVotes,item){
		if (item.type=="city"){
			for (var j=0;j<item.items.length;j++){
				party = item.items[j]
				if (!(party.name in totalVotes)){
					totalVotes[party.name] = 0;
				}
				totalVotes[party.name] += party.votes;
			}
		} else if (item.type=="group"){
			for (var j=0;j<item.items.length;j++){
				subItem = item.items[j]
				totalVotes = addVotesFromItem(totalVotes,subItem)
			}
		}
		return totalVotes;
	}