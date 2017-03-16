// var result = parser.xml_str2json('<person><name>Wes</name></person>')
// console.log(result);

// $.ajax({
//   ...
// }).then(function (result) {
//   var parser = new X2JS()
//   var result = parser.xml_str2json(result.xml)
//   // result is your json object
// })

var corsApi = 'http://galvanize-cors-proxy.herokuapp.com/';
var searchResultJSON;
$('form').submit(function(e) {
    e.preventDefault();

    var searchstring = $('.input-sm').val();
    var url = corsApi + 'https://www.boardgamegeek.com/xmlapi/search?search=' + searchstring;

    $.ajax({
        method: "GET",
        url: url
    }).then(function(result) {
        var parser = new X2JS();
        result = parser.xml2json(result);
        // console.log(JSON.stringify(result));


        for (var i = 0; i < result.boardgames.boardgame.length; i++) {
            var gameTitle = result.boardgames.boardgame[i].name.__text;
            var objId = result.boardgames.boardgame[i]._objectid;
            // console.log(objId);

            $(".modal-body").prepend($(`<p>${gameTitle}<button type="button" class="btn btn-primary btn-xs gameinfo" id="${objId} ">Add Game</button></p>`));
        }

        $("#myModal").modal('show');

        $('.gameinfo').on('click', function(e) {
            e.preventDefault();

            var idUrl = corsApi + `https://www.boardgamegeek.com/xmlapi/boardgame/${$(this).attr('id')}`;
            // console.log(idUrl);

            $.ajax({
                method: "GET",
                url: idUrl
            }).then(function(idResult) {
                var parser = new X2JS();
                idResult = parser.xml2json(idResult);
                // console.log(idResult);
                // console.log(JSON.stringify(idResult));
                // console.log(idResult.boardgames.boardgame);

                var thumbnailImg = idResult.boardgames.boardgame.thumbnail;
                var minPlayers = idResult.boardgames.boardgame.minplayers;
                var maxPlayers = idResult.boardgames.boardgame.maxplayers;
                var playingTime = idResult.boardgames.boardgame.playingtime;
                var objectId = idResult.boardgames.boardgame._objectid;
                var gameName;

                if (Array.isArray(idResult.boardgames.boardgame.name)) {
                  for (var i = 0; i < idResult.boardgames.boardgame.name.length; i++) {
                    idResult.boardgames.boardgame.name[i];
                    if (idResult.boardgames.boardgame.name[i]._primary) {
                      gameName = idResult.boardgames.boardgame.name[i].__text;
                    }
                  }
                } else {
                  gameName = idResult.boardgames.boardgame.name.__text;
                }

                $(".games-row").prepend($(`
                  <div class="col-xs-8 portfolio-item">
                    <a href="#">
                        <img class="img-responsive" src="http:${thumbnailImg}" alt="">
                    </a>
                    <h4>
                      <a href="#" class="game-name">${gameName}</a>
                    </h4>
                    <div class="game-data">
                        <p class="players"><strong>Suggested Players -</strong> <br><span>Min :</span> ${minPlayers} <br><span>Max :</span> ${maxPlayers}
                        </p>
                        <p class="play-time"><strong>Play Time: </strong> <br> ${playingTime}
                        </p>
                        <a class="rulez-collapse" data-toggle="collapse" href="#rulez${objectId}" aria-expanded="false" aria-controls="rulez${objectId}"> View, Add, or Edit Rulez </a>
                        <ul>
                          <div class="rulez" id="rulez${objectId}" aria-expanded="false">
                            <div class="card card-block">
                            <a  id="add">+</a></td>
                            <table id="mytable" width="300" border="1" cellspacing="0" cellpadding="2">
                            <tbody>
                              <tr>
                                <td>Rule Title</td>
                              </tr>
                              <tr class="Rule Title">
                                <td><input type="text" name="title" id="title" /></td>
                              </tr>
                              <tr>
                                <td>Rule Title</td>
                              </tr>
                              <tr class="Rule Title">
                                <td><input type="text" name="title" id="title" /></td>
                              </tr>
                              <tr>
                                <td>Rule Title</td>
                              </tr>
                              <tr class="Rule Title">
                                <td><input type="text" name="title" id="title" /></td>
                              </tr>
                              </tbody>
                            </table>
                            </div>
                          </div>
                        </ul>
                        <a class="errata-collapse" data-toggle="collapse" href="#errata${objectId}" aria-expanded="false" aria-controls="errata${objectId}"> View, Add, or Edit Errata </a>
                        <ul>
                          <div class="collapse" id="errata${objectId}" aria-expanded="false">
                            <div class="card card-block">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                            </div>
                          </div>
                        </ul>
                    </div>
                </div>`));
                $('.errata${objectId}').collapse("hide");
                $('.rulez${objectId}').collapse("hide");
            });
        });
    });
});

$(document).ready(function() {
    $("#add").click(function() {
      $('#mytable tbody>tr:last').clone(true).insertAfter('#mytable tbody>tr:last');
      return false;
    });
});
