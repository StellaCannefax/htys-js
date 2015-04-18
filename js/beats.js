var dancer = new Dancer();

// events is an array of objects , each containing
// "time" , the value in seconds for when to trigger, & 
// "handler", the function that actually modifies behavior
var SongSettings = function (url, kickSettings, events) {  
    this.kick = dancer.createKick(kickSettings);
    this.url = url;
    this.events = events;
}

// extension method for dancer.js, feed a songSettings object
dancer.startNewSong = function (song) {
    this.load({ src: song.url });                
    song.events.forEach(function (event) {          
        dancer.onceAt(event.time, event.handler);   // register custom events    
    })
    song.kick.on();
    this.play();      
}
