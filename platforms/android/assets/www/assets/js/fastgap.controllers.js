var AppController = function () {};

AppController.prototype = {
	initialize: function () {  },
  destroy: function () {
    PageLoad.ajxHandle = null;
  }
};

var HomeController = function () {};
HomeController.prototype.initialize = function () {
  var self = this;

  API = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=djalmaaraujo&api_key=a01a539651177e4422eb7e71882e14fa&format=json";
  $.ajax({
    url: API,
    type: "GET",
    success: self.handleRecentTracks
  });
}

HomeController.prototype.handleRecentTracks = function (data) {
  var tracks          = data.recenttracks.track;
  var tracksTemplates = "";
  var trackList       = $('<ul class="track-list" />');

  tracks.forEach(function (song) {
    var playing = (song["@attr"] && song["@attr"].nowplaying) ? true : false;
    var image = (song.image[3]["#text"] !== "") ? song.image[2]["#text"] : "assets/img/art-not-found.jpg";

    tracksTemplates += tmpl("track_tpl", {
      image: image,
      playing: playing,
      title: song.name,
      artist: song.artist["#text"],
      album: song.album["#text"],
      when: song.date
    });
  });

  trackList.append(tracksTemplates);
  $("#internal-page").html(trackList);
}

HomeController.prototype.destroy = function () {
	FG.scroll = null;
	PageLoad.ajxHandle = null;
}

var WeeklyController = function () {};
WeeklyController.prototype.initialize = function () {
  var self = this;

  API = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=djalmaaraujo&api_key=a01a539651177e4422eb7e71882e14fa&format=json&extended=1";
  $.ajax({
    url: API,
    type: "GET",
    success: self.handleWeeklyChart
  });
}

WeeklyController.prototype.handleWeeklyChart = function (data) {
  var weekly        = data.weeklyartistchart.artist;
  var weeklyArtists = "";
  var weeklyList = $('<ul id="weekly-artist" />');

  weekly.forEach(function (artist) {
    weeklyArtists += tmpl("weekly_tpl", {
      name: artist.name,
      count: parseInt(artist.playcount)
    });
  });

  weeklyList.append(weeklyArtists);

  $("#internal-page").html(weeklyList);
}

WeeklyController.prototype.destroy = function () {
  FG.scroll = null;
  PageLoad.ajxHandle = null;
}
