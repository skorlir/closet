var Item = require('../models/Item.js')
	, Account = require('../models/Account.js')
	, Hobby = require('../models/Hobby.js')
	, ObjectId = require('mongoose').Types.ObjectId;

module.exports = function() {
	
	//TODO: upload form, activity feed
	
	var Ouser2 = {
		username: "user2",
		email: "test2@test.com",
		realName: { firstName: "John", lastName: "Smith" },
		hobbies: ["Camping", "Wine", "Videogames", "Fashion"],
		profilePicture: "/images/user2.jpg",
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};

	var Ouser3 = {
		username: "user3",
		email: "test3@test.com",
		realName: { firstName: "Andy", lastName: "Trudeau" },
		hobbies: ["Camping", "Wine", "Videogames", "Fashion"],
		profilePicture: "/images/user3.jpg",
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};
	
	var OtestUser = {
		username: "testUser",
		email: "test@test.com",
		realName: {firstName: "Abigail", lastName: "User" },
		hobbies: ["Camping", "Wine", "Videogames", "Fashion"],
		profilePicture: "/images/user1.jpg",
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};
	
	var user2 = new Account(Ouser2)
		, user3 = new Account(Ouser3)
		, testUser = new Account(OtestUser);
	
	testUser.friends.push(user2._id, user3._id);
	user2.friends.push(user3._id, testUser._id);
	user3.friends.push(user2._id, testUser._id);
	
	var Owatch_dogs = {
		name: 'Watch_Dogs',
		hobbies: ['videogames'],
		description: "All it takes is the swipe of a finger. We connect with friends. We buy the latest gadgets and gear. We find out what's happening in the world. But with that same simple swipe, we cast an increasingly expansive shadow. With each connection, we leave a digital trail that tracks our every move and milestone, our every like and dislike. And it's not just people. Today, all major cities are networked. Urban infrastructures are monitored and controlled by complex operating systems. In Watch_Dogs, this system is called the Central Operating System (CTOS) – and it controls almost every piece of the city's technology and holds key information on all of the city's residents. You play as Aiden Pearce, a brilliant hacker and former thug, whose criminal past led to a violent family tragedy. Now on the hunt for those who hurt your family, you'll be able to monitor and hack all who surround you by manipulating everything connected to the city's network. Access omnipresent security cameras, download personal information to locate a target, control traffic lights and public transportation to stop the enemy…and more. Use the city of Chicago as your ultimate weapon and exact your own style of revenge.",
		bannerPhoto: 'WatchDogs_Banner.jpg',
		tilePhoto: 'Watch_DogsTile.jpg',
		rating: 8.4,
		timestamp: new Date(),
		owner: testUser._id
	};
	
	var OtombRaider = {
		name: 'Tomb Raider: Definitive Edition',
		hobbies: ['videogames'],
		description: "The cinematic action-adventure that forced Lara Croft to grow from an inexperienced young woman into a hardened survivor has been re-built for Xbox One and PS4, featuring an obsessively detailed Lara and a stunningly lifelike world. To survive her first adventure and uncover the island's deadly secret, Lara must endure high-octane combat, customize her weapons and gear, and overcome grueling environments. The Definitive Edition of the critically-acclaimed action-adventure includes digital versions of the Dark Horse comic, Brady games mini-art book and combines all of the DLC.",
		bannerPhoto: 'TombRaiderBanner.jpg',
		tilePhoto: 'TombRaiderTile.jpg',
		rating: 8.0,
		timestamp: new Date(),
		owner: user3._id
	};
	
	var OinfamousSecondSon = {
		name: 'inFAMOUS: Second Son',
		hobbies: ['videogames'],
		description: 'inFAMOUS Second Son, a PlayStation 4 exclusive, brings you an action adventure game where surrounded by a society that fears them, superhumans are ruthlessly hunted down and caged by the Department of Unified Protection. Step into a locked-down Seattle as Delsin Rowe, who has recently discovered his superhuman power and is now capable of fighting back against the oppressive DUP. Enjoy your power as you choose how you will push your awesome abilities to the limit and witness the consequences of your actions as they affect the city and people around you.',
		bannerPhoto: 'inFAMOUSSecondSonBanner.jpg',
		tilePhoto: 'inFAMOUSSecondSonTile.jpg',
		rating: 7.7,
		timestamp: new Date(),
		owner: user2._id
	};

	var watch_dogs = new Item(Owatch_dogs)
			, tombRaider = new Item(OtombRaider)
			, infamousSecondSon = new Item(OinfamousSecondSon);
	
	//FIXME: this should reference by ids
	user2.myCollection.push(infamousSecondSon);
	user3.myCollection.push(tombRaider);

	var videogameActivity = { 
				 owner: user2._id,
				 timestamp: new Date(),
				 tilePhoto: 'titanfallTile.jpg',
				 description: 'Just pre-ordered a copy of Titanfall!'
				}
	
	var Ovideogames = {
		name: 'videogames',
		members: [user2._id, user3._id, testUser],
		bannerPhoto: 'videogamesBanner.jpg',
		activity: [videogameActivity]
	};
	
	Item.create([watch_dogs, tombRaider, infamousSecondSon], function(err, w, t, i) {
		if(err) console.log(err);
		
		Item.find({ name: 'Watch_Dogs' }).exec().addBack(function(e, r){
			if(e) console.log(e);
			OtestUser.myCollection.push(r[0]);
			return Item.find({ name: 'Tomb Raider: Definitive Edition' }).exec();
		})
		.addBack(function(e,r) {
			if(e) console.log(e);
			
			OtestUser.favorites.push(r[0]);
		})
		.then(function() {	
			Account.register(user2, 'test123', function(err) {
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(user3, 'test123', function(err) {	
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(testUser, "test123", function(err) {
				if (err) console.log(err);
			});
		})
		.then(function(r) {
							
			var videogames = new Hobby(Ovideogames);

			videogames.save(function(err, v) {
				if(err) console.log(err);
			});
		});
	});
}
