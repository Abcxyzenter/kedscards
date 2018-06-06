var store = new Vuex.Store({


state: {

  		slidercards:[], 

  		cards:[] 
  	 
  		},



actions: {


  	getCards (context, limslid) {
      
 		 
        var jsonURL = 'https://raw.githubusercontent.com/Abcxyzenter/jsons/master/cards.json'
      	
      	fetch(jsonURL)
 			 .then(response => response.json())
  				.then(json => context.commit('vuexAllCards', json) )
  					.then(json => context.commit('vuexSlider', limslid));
  				
       	},

    addCards (context, indexed) {context.commit('addToSliderArr', indexed)}
  
   	},



mutations: {


    vuexAllCards (state, cardJson ){
 
    	this.state.cards = Object.assign({}, this.state.cards, cardJson)
   		   
        },


    vuexSlider (state, limslider) {

       	let tmp = [];

   		  for (let i=0; i<limslider; i++){
 				
 				tmp[i] = this.state.cards[i]
 				 
   		    }

   		this.state.slidercards = Object.assign({}, this.state.slidercards, tmp)
 
       },



    addToSliderArr (state, indexed){

    	let newCard = this.state.cards[indexed]

    	Vue.set(this.state.slidercards, indexed, newCard)
 
  	   },
  
    },

 

 getters:{

 	returner: (state) => (arr, entry) =>  state[arr][entry],

 	returnerFirstId : (state) => (arr) =>  state[arr][0]['id'],
 
 	lengther: (state) => (arr) =>  Object.keys(state[arr]).length
 
	}
   
})




 
 
var carditem = Vue.component ('carditem', {


	template: '#carditem',
	
	props: ['id', 'imge', 'markerbottom', 'markerleft', 'markerright', 'maintxt', 'user', 'rating', 'votes', 'price'],
 
 
	data: function() {

		return {

			liked:false,
			likeme: 'welllike',
			nolikes: '',

			detail:false,
			details: 'showme',
			hided: 'hiddencls'

		}

	},


  	methods: {

  		showdetail: function(){

  			this.detail = !this.detail
         
        },
 
  		like: function(){

  			this.liked = !this.liked
         
        },
 
  		cut: function (el) {
      
     	 	return el.split('').slice(0,60).join('')+'...'
     	   
    	} 
 
	},

 
}) 




 
new Vue({

 
	data: function() {return{

		 
		limitList:2,
  
		limSlider:0,
		sliderCartMargin:0,
		fromstart:0,
		fromend: 0,
 
   
		}

	},

  

 	components: {

    	'carditem': carditem
 
	},
 

 
 	methods:{
  
  		btnright: function(){
 
  			if (this.fromend == 0) (this.fromend = store.getters.lengther('cards')) 
  			 
  			let frstEl = document.getElementById(store.getters.returnerFirstId('slidercards'))
  			let shuNode = frstEl.parentNode
 
 			if (store.getters.lengther('cards')>store.getters.lengther('slidercards')){
  	 	  
			this.$store.dispatch('addCards', this.fromend-1)

			document.getElementById('sld').classList.toggle('rightmove')

			setTimeout (function(){

				document.getElementById('sld').classList.toggle('rightmove')

				shuNode.insertBefore(document.getElementById(store.getters.lengther('cards')), frstEl)

				if (shuNode.firstChild !== frstEl)
					
					{shuNode.insertBefore(shuNode.lastChild,shuNode.firstChild)}

			}, 200)
 
			return this.fromend = this.fromend-1
 
			}

			else {

 				frstEl.parentNode.insertBefore(frstEl.parentNode.lastChild, frstEl.parentNode.firstChild)
 			
 				document.getElementById('sld').classList.toggle('rightmove')

				setTimeout (function(){document.getElementById('sld').classList.toggle('rightmove')}, 200)

			}
  
  		},




  		btnleft: function(){
  
  			var frstEl = document.getElementById(store.getters.returnerFirstId('slidercards'))
  			   
			if (store.getters.lengther('cards')>store.getters.lengther('slidercards')){
			   
				if (this.fromstart>=this.limSlider){this.fromstart = this.fromstart+1}

				else {this.fromstart = this.limSlider}
 
				this.$store.dispatch('addCards', this.fromstart)
 
			}

			document.getElementById('sld').classList.toggle('leftmove')
 		 
			setTimeout(function(){

				document.getElementById('sld').classList.toggle('leftmove')
 
				frstEl.parentNode.appendChild(frstEl.parentNode.firstChild)
				 
			}, 200)  
  		},



  		onresizer: function (event){


  		let percentwidth = 0.8 
  		let screenwin = document.documentElement.clientWidth

  		if (screenwin>1600){percentwidth = 0.9}
  		if (1300<screenwin<1600){percentwidth = 0.8}
  		if (1024<screenwin<1300){percentwidth = 0.7}
  		if (400<screenwin<1024){percentwidth = 0.6}
  		if (screenwin<400){percentwidth = 0.9}
  		  
  		let inwrap = Math.ceil((screenwin*percentwidth)/190)

  		let actualMargin = (screenwin-(inwrap*190))/inwrap-1

  		if (screenwin<400){actualMargin = 0}

  		return this.limSlider = inwrap-1, sliderCartMargin = actualMargin

  		},



  	},



  	created: function (){

  	if (this.$store.state.cards == ''){

  		this.onresizer()

  		}
  
  	},



 	beforeMount: function() {
 
     	if (this.$store.state.cards == ''){
  
  		this.$store.dispatch('getCards', this.limSlider)

      	} 
 
  	},
 
 

 	mounted: function(){

 		this.$nextTick (function() {

  			window.addEventListener('resize', this.onresizer);
  		 	
  		 	this.onresizer()

  		})

  	},
 
  	beforeDestroy: function() {

    window.removeEventListener('resize', this.onresizer);

	},
 
store

}).$mount('#app')

 